import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
const markers = [
  "DEV_MOCK_NO_AUTH_NEVER_SEND",
  "DEV_SHELL_ERROR_BOUNDARY_PROBE",
];
async function visit(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) await visit(file);
    else if (file.endsWith(".js")) {
      const source = await readFile(file, "utf8");
      if (markers.some((marker) => source.includes(marker)))
        throw new Error(
          "Dev-only implementation leaked into production: " + file,
        );
    }
  }
}
await visit(".next/static");
await visit(".next/server");
console.log("Production guard passed: no dev mock or crash harness code.");
