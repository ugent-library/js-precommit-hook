import "colors";
import { exec } from "promisify-child-process";

async function run() {
  const re = /(\bdebugger\b|\b(?:it|test|describe|context|suite)\.(?:only|skip)\s*\(|\bx(?:it|test|describe)\s*\()/;

  // -U0: no context lines, so every "+" line is an actual addition.
  const { stdout } = await exec(
    "git -c core.quotepath=false diff --cached -U0 --no-color --no-ext-diff --diff-filter=ACM",
    { maxBuffer: 50 * 1024 * 1024 },
  );
  if (!stdout) {
    return;
  }
  
  let file = null,
    line = 0;

  for (const diffLine of stdout.split("\n")) {
    if (diffLine.startsWith("+++ ")) {
      const target = diffLine.slice(4);
      file = target === "/dev/null" ? null : target.replace(/^b\//, "");
      continue;
    }

    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(diffLine);
    if (hunk) {
      line = Number(hunk[1]);
      continue;
    }

    if (!file || !diffLine.startsWith("+")) {
      continue;
    }

    const added = diffLine.slice(1);
    const m = re.exec(added);
    if (m) {
      console.error(
        "Commit rejected:".bgRed.bold,
        "Found",
        `"${m[1]}"`.yellow.bold,
        "in file",
        file.yellow.bold,
        "at line",
        line.toString().yellow.bold,
        "position",
        (m.index + 1).toString().yellow.bold,
      );

      process.exit(1);
    }

    line++;
  }
}

run();
