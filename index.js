import fs from "node:fs";
import path from "node:path";

import "colors";
import { exec } from "promisify-child-process";

async function run() {
  const re = /(\Wdebugger\W|\.only\s*\(|\.skip\s*\(|\Wxit\s*\()/;

  const { stdout } = await exec(
    "git diff --cached --name-only --diff-filter=ACM",
  );
  if (stdout) {
    const files = stdout.trim().split("\n");

    for (const file of files) {
      const content = fs.readFileSync(
        path.resolve(process.cwd(), file),
        "utf-8",
      );

      const m = re.exec(content);
      if (m) {
        let matchIndex = m.index,
          matchLine = 1;
        for (const line of content.split("\n")) {
          if (line.length > matchIndex) {
            break;
          }

          matchIndex -= line.length + 1; // also count the line feed
          matchLine++;
        }

        console.error(
          "Commit rejected:".bgRed.bold,
          "Found",
          `"${m[1]}"`.yellow.bold,
          "in file",
          file.yellow.bold,
          "at line",
          matchLine.toString().yellow.bold,
          "position",
          (matchIndex + 1).toString().yellow.bold,
        );

        process.exit(1);
      }
    }
  }
}

run();
