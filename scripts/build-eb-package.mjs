import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workspaceRoot = resolve(__dirname, "..");
const frontendDir = resolve(workspaceRoot, "frontend");
const backendDir = resolve(workspaceRoot, "backend");
const frontendDistDir = resolve(frontendDir, "dist");
const deployDir = resolve(workspaceRoot, "deploy", "team-task-api-eb");

function runCommand(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      ...env,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensurePath(path, message) {
  if (!existsSync(path)) {
    throw new Error(message);
  }
}

try {
  ensurePath(frontendDir, "Missing frontend directory.");
  ensurePath(backendDir, "Missing backend directory.");

  console.log("Building frontend with VITE_API_URL=/api ...");
  runCommand("npm", ["run", "build"], frontendDir, { VITE_API_URL: "/api" });

  ensurePath(frontendDistDir, "Frontend build failed: dist directory was not generated.");

  console.log("Preparing deployment folder ...");
  rmSync(deployDir, { recursive: true, force: true });
  mkdirSync(deployDir, { recursive: true });

  cpSync(resolve(backendDir, "src"), resolve(deployDir, "src"), { recursive: true });
  cpSync(resolve(backendDir, "package.json"), resolve(deployDir, "package.json"));

  if (existsSync(resolve(backendDir, "package-lock.json"))) {
    cpSync(resolve(backendDir, "package-lock.json"), resolve(deployDir, "package-lock.json"));
  }

  if (existsSync(resolve(backendDir, ".env.example"))) {
    cpSync(resolve(backendDir, ".env.example"), resolve(deployDir, ".env.example"));
  }

  cpSync(frontendDistDir, resolve(deployDir, "public"), { recursive: true });

  writeFileSync(
    resolve(deployDir, "README_BEANSTALK.md"),
    [
      "# Elastic Beanstalk package",
      "",
      "This folder is generated automatically.",
      "",
      "## Contains",
      "- Node backend at root (package.json + src)",
      "- Compiled frontend in public/",
      "",
      "## Deploy",
      "1. Zip the contents of this folder (not the parent deploy folder).",
      "2. Upload to an Elastic Beanstalk Node.js environment.",
      "3. Configure environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.).",
      "",
      "## Runtime behavior",
      "- API routes are served under /api/*",
      "- React SPA is served from public/ with fallback to index.html",
    ].join("\n")
  );

  console.log("Done. Deployment folder created at:");
  console.log(deployDir);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
