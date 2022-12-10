import * as core from "@actions/core";
import * as github from "@actions/github";

import { getChangelog, isPrerelease } from "./utils";

enum Input {
  githubToken = "githubToken",
  tag = "tag",
  title = "title",
  zeroIsPreRelease = "zeroIsPreRelease",
  testMode = "testMode",
}

async function run() {
  const ghToken = core.getInput(Input.githubToken);
  const octokit = github.getOctokit(ghToken);
  const { owner, repo } = github.context.repo;

  const version = core.getInput(Input.tag)?.split("/")?.at(-1);

  if (!version) throw new Error(`Invalid Version: ${version}`);

  const prerelease = isPrerelease(
    version,
    core.getBooleanInput(Input.zeroIsPreRelease)
  );

  const body = (await getChangelog(version)) ?? "";
  const ReleaseName = `${core.getInput(Input.title) || "Release"} ${version}`;

  const postBody = {
    owner,
    repo,
    tag_name: version,
    name: ReleaseName,
    body,
    prerelease,
    generate_release_notes: true,
  };

  if (core.getBooleanInput(Input.testMode)) {
    core.info(JSON.stringify(postBody, null, 2));
    core.info("Test Mode Completed");
  } else {
    await octokit.request("POST /repos/{owner}/{repo}/releases", postBody);
    core.info(`Release version ${version} success`);
  }
}

run().catch((error) => {
  core.setFailed(`Unexpected ERROR: ${error.message}`);
});
