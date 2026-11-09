import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

export function findRawHex(text) {
  return [...text.matchAll(/#[\da-fA-F]{3,8}\b/g)].map((match) => match[0]);
}
export async function audit(directory = "src") {
  const errors = [];
  async function visit(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (
        /\.(?:css|tsx?|jsx?)$/.test(path) &&
        relative(directory, path) !== "styles/tokens.css"
      ) {
        const text = await readFile(path, "utf8");
        for (const hex of findRawHex(text))
          errors.push(path + ": raw color " + hex);
        if (
          path.endsWith(".css") &&
          /(?:border-radius|box-shadow|transition(?:-duration)?|animation-duration)\s*:[^;{}]*\b\d+(?:px|ms)\b/.test(
            text,
          )
        )
          errors.push(path + ": untokenized radius/shadow/motion");
      }
    }
  }
  await visit(directory);
  return errors;
}
if (process.argv[1]?.endsWith("check-design.mjs")) {
  const errors = await audit();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Design audit passed: no raw hex or untokenized radius/shadow/motion in source.",
    );
}
