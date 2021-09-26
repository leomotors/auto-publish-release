const core = require("@actions/core");
const github = require("@actions/github");

const fs = require("fs").promises;

async function getVersion() {
    const buffer = await fs.readFile("package.json");
    const package_data = JSON.parse(buffer.toString());
    const version = package_data.version;

    return version;
}

async function run() {
    try {
        const version = await getVersion();

        const ghToken = core.getInput("GITHUB_TOKEN");
        const octokit = github.getOctokit(ghToken);

        const { owner, repo } = github.context.repo;

        const ReleaseName = `Release ${version}`;

        await octokit.request("POST /repos/{owner}/{repo}/releases", {
            owner,
            repo,
            tag_name: version,
            name: ReleaseName
        });
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();
