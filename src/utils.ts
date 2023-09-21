import fs from "node:fs/promises";

export function isPrerelease(version: string, zeroIsPreRelease: boolean) {
  if (version.startsWith("0") && zeroIsPreRelease) return true;

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

export async function getChangelog(version: string, path: string) {
  try {
    const lines = (await fs.readFile(path)).toString().split("\n");

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
