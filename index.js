// @ts-check

const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs").promises;

/**
 * @returns {Promise<string>}
 */
async function getVersion_PackageJson() {
    const buffer = await fs.readFile("package.json");
    const package_data = JSON.parse(buffer.toString());
    const version = package_data.version;

    // * X.Y.Z => 5..
    if (version.length < 5) throw new Error("Invalid Version");

    return version;
}

/**
 * @param {string} version
 * @returns {boolean}
 */
function versionIsPrerelease(version) {
    if (version.startsWith("0")) return true;

    for (const kw of ["alpha", "beta", "dev", "pre", "rc", "insider", "next"])
        if (version.includes(kw)) return true;
    return false;
}

/**
 * @param {string} version
 * @returns {Promise<string | null>}
 */
async function getChangelog(version) {
    try {
        const buffer = await fs.readFile("CHANGELOG.md");
        const lines = buffer.toString().split("\n");

        let body = "";

        let startlevel = 0;
        let started = false;
        for (const line of lines) {
            if (line.startsWith("#") && line.includes(version)) {
                startlevel = line.split("").filter((c) => c == "#").length;
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

async function run() {
    const ghToken = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(ghToken);
    const versionSrc = core.getInput("VERSION_SOURCE") || "PACKAGE_JSON";
    const { owner, repo } = github.context.repo;

    const commitMsg = core.getInput("RELEASE_ON_KEYWORD");

    if (
        commitMsg.length > 0 &&
        !commitMsg.toLowerCase().includes("[release]")
    ) {
        core.info(
            "RELEASE_ON_KEYWORD is activated, but no keywords found. ABORT"
        );
        return;
    }

    let version = "";
    if (versionSrc == "PACKAGE_JSON") {
        version = await getVersion_PackageJson();
    } else if (versionSrc == "COMMIT_COUNT") {
        const res = await octokit.request(
            "/repos/{owner}/{repo}/contributors",
            {
                owner,
                repo,
            }
        );

        let totalCommit = 0;
        for (const contributor of res.data) {
            totalCommit += contributor.contributions;
        }

        version = `${
            core.getInput("VERSION_MAJOR_MINOR") || "1.0"
        }.${totalCommit}`;
    } else {
        throw new Error(`Unknown Version Source of ${versionSrc}`);
    }

    if (!version) throw new Error(`Invalid Version: ${version}`);

    const prerelease = versionIsPrerelease(version);

    // * Get Current Date by GitHub Copilot
    const date = new Date();
    const dateString = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;

    const transform = (str) =>
        str.replace("{VERSION}", version).replace("{DATE}", dateString);

    const body =
        (await getChangelog(version)) ||
        transform(core.getInput("CHANGELOG_BODY"));

    const ReleaseName =
        transform(core.getInput("RELEASE_TITLE")) || `Release ${version}`;

    const alwaysGenerate = core.getBooleanInput("ALWAYS_GENERATE_NOTES");

    // * Release Release
    await octokit
        .request("POST /repos/{owner}/{repo}/releases", {
            owner,
            repo,
            tag_name: version,
            name: ReleaseName,
            body,
            prerelease,
            generate_release_notes: !body || alwaysGenerate,
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
            } else {
                // * Other Error, THROW IT
                throw error;
            }
        });

    core.info("Release Success");
}

run().catch((error) => {
    core.setFailed(`Unexpected ERROR: ${error.message}`);
});
