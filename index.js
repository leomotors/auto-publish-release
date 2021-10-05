const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs").promises;

async function getVersion() {
  const buffer = await fs.readFile("package.json");
  const package_data = JSON.parse(buffer.toString());
  const version = package_data.version;

  // * X.Y.Z => 5..
  if (version.length < 5) throw new Error("Invalid Version");

  return version;
}

async function getChangelog(version) {
  try {
    const buffer = await fs.readFile("CHANGELOG.md");
    const lines = buffer.toString().split("\n");

    let body = "";

    let startlevel = 0;
    for (const line of lines) {
      if (line.startsWith("#") && line.includes(version)) {
        startlevel = line.split("").filter((c) => c == "#").length;
      }

      if (startlevel) {
        if (line.startsWith("#".repeat(startlevel)) && !line.includes(version))
          return body;
        body += line + "\n";
      }
    }
    return body;
  } catch (err) {
    return null;
  }
}

async function run() {
  try {
    const version = await getVersion();

    const ghToken = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(ghToken);

    const { owner, repo } = github.context.repo;

    const ReleaseName = `Release ${version}`;

    const body =
      (await getChangelog(version)) || core.getInput("CHANGELOG_BODY");

    await octokit.request("POST /repos/{owner}/{repo}/releases", {
      owner,
      repo,
      tag_name: version,
      name: ReleaseName,
      body,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
