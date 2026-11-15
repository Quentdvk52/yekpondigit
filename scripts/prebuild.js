import fs from "node:fs";
import path from "node:path";

function mirrorDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const srcSub = path.join(src, entry.name);
      const destSub = path.join(dest, entry.name);
      mirrorDir(srcSub, destSub);
    }
  }
}

const appDir = path.resolve("src/app");
const targetDir = path.resolve(".next/types/app");

mirrorDir(appDir, targetDir);
console.log("Prebuild: .next/types/app mirrored successfully.");
