import core from "@actions/core";
import github from "@actions/github";

import fs from "node:fs/promises";

async function getVersion_PackageJson() {
  try {
    const buffer = await fs.readFile("package.json");
    const package_data = JSON.parse(buffer.toString());
    const version = package_data.version as string;

    // * X.Y.Z => 5..
    if (version.length < 5) throw new Error("Invalid Version");

    return version;
  } catch (err) {
    return null;
  }
}

/**
 * @returns {Promise<string | null>}
 */
async function getVersion_setupCfg() {
  try {
    const lines = (await fs.readFile("setup.cfg")).toString().split("\n");
    for (const line of lines) {
      const tokens = line.split("=");
      if (tokens.length !== 2) continue;

      if (tokens[0].trim().toLowerCase() === "version") {
        return tokens[1].trim();
      }
    }
  } catch (err) {
    // pass
  }

  return null;
}

function versionIsPrerelease(version: string) {
  if (
    version.startsWith("0") &&
    !core.getBooleanInput("LEADING_ZERO_IS_RELEASE")
  )
    return true;

  for (const kw of [
    "alpha",
    "beta",
    "dev",
    "pre",
    "rc",
    "insider",
    "next",
    "experi",
    "test",
  ])
    if (version.includes(kw)) return true;
  return false;
}

async function getChangelog(version: string) {
  try {
    const lines = (await fs.readFile("CHANGELOG.md")).toString().split("\n");

    let body = "";

    let startlevel = 0;
    let started = false;
    for (const line of lines) {
      if (line.startsWith("#") && line.includes(version)) {
        startlevel = line.split("").filter((c) => c === "#").length;
      }

      if (startlevel) {
        if (
          line.startsWith("#".repeat(startlevel)) &&
          !line.startsWith("#".repeat(startlevel + 1)) &&
          started
        )
          return body;
        body += line + "\n";
        started = true;
      }
    }
    return body;
  } catch (err) {
    return null;
  }
}

function checkDep(key: string) {
  if (core.getInput(key)) {
    core.warning(`${key} option is deprecated but recieved!`);
  }
}

async function run() {
  ["VERSION_SOURCE", "VERSION_MAJOR_MINOR", "ALWAYS_GENERATE_NOTES"].forEach(
    (k) => checkDep(k)
  );

  const ghToken = core.getInput("GITHUB_TOKEN");
  const octokit = github.getOctokit(ghToken);
  const { owner, repo } = github.context.repo;

  const commitMsg = core.getInput("RELEASE_ON_KEYWORD");

  if (commitMsg.length > 0 && !commitMsg.toLowerCase().includes("[release]")) {
    core.info("RELEASE_ON_KEYWORD is activated, but no keywords found. ABORT");
    return;
  }

  const version =
    (core.getInput("tag")?.split("/")?.at(-1) ||
      (await getVersion_PackageJson())) ??
    (await getVersion_setupCfg());

  if (!version) throw new Error(`Invalid Version: ${version}`);

  const prerelease = versionIsPrerelease(version);

  // * Get Current Date by GitHub Copilot
  const date = new Date();
  const dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  const transform = (str: string) =>
    str.replace("{VERSION}", version).replace("{DATE}", dateString);

  const body =
    (await getChangelog(version)) || transform(core.getInput("CHANGELOG_BODY"));

  const ReleaseName =
    transform(core.getInput("RELEASE_TITLE")) || `Release ${version}`;

  // * Release Release
  await octokit
    .request("POST /repos/{owner}/{repo}/releases", {
      owner,
      repo,
      tag_name: version,
      name: ReleaseName,
      body,
      prerelease,
      generate_release_notes: true,
    })
    .catch((error) => {
      const mustIncrease = core.getBooleanInput("VERSION_MUST_INCREASE");

      if (error.message.includes("already_exists")) {
        if (mustIncrease) {
          core.setFailed("Version did not increased as expected");
          return;
        } else {
          core.info("Already Exists: ABORT");
          return;
        }
      }

      // * Other Error, THROW IT
      throw error;
    });

  core.info("Release Success");
}

run().catch((error) => {
  core.setFailed(`Unexpected ERROR: ${error.message}`);
});
