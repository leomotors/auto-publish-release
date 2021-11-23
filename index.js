// @ts-check

const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs").promises;
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

async function getVersion_PackageJson() {
    const buffer = await fs.readFile("package.json");
    const package_data = JSON.parse(buffer.toString());
    const version = package_data.version;

    // * X.Y.Z => 5..
    if (version.length < 5) throw new Error("Invalid Version");

    return version;
}

function versionIsPrerelease(version) {
    for (const kw of ["alpha", "beta", "dev", "pre", "rc", "insider", "next"])
        if (version.includes(kw)) return true;
    return false;
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
                if (
                    line.startsWith("#".repeat(startlevel)) &&
                    !line.includes(version)
                )
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
        const ghToken = core.getInput("GITHUB_TOKEN");
        const octokit = github.getOctokit(ghToken);

        const versionSrc = core.getInput("VERSION_SOURCE") || "PACKAGE_JSON";

        let version = "";
        if (versionSrc == "PACKAGE_JSON") {
            version = await getVersion_PackageJson();
        } else if (versionSrc == "COMMIT_COUNT") {
            // * Get Number of Commits
            const commitCount = (
                await exec("git rev-list HEAD --count")
            ).stdout.replace(/^\s+|\s+$/g, "");

            version = `${
                core.getInput("VERSION_MAJOR_MINOR") || "1.0"
            }.${commitCount}`;
        } else {
            throw new Error(`Unknown Version Source of ${versionSrc}`);
        }

        if (!version) throw new Error(`Invalid Version: ${version}`);

        const prerelease = versionIsPrerelease(version);

        const { owner, repo } = github.context.repo;

        const ReleaseName = `Release ${version}`;

        // * Get Current Date by GitHub Copilot
        const date = new Date();
        const dateString = `${date.getFullYear()}-${
            date.getMonth() + 1
        }-${date.getDate()}`;

        const body =
            (await getChangelog(version)) ||
            core
                .getInput("CHANGELOG_BODY")
                .replace("{VERSION}", version)
                .replace("{DATE}", dateString);

        await octokit.request("POST /repos/{owner}/{repo}/releases", {
            owner,
            repo,
            tag_name: version,
            name: ReleaseName,
            body,
            prerelease,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
