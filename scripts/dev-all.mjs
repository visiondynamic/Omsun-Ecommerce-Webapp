import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const serverDir = path.resolve(rootDir, "server-api");

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

console.log("\x1b[36m%s\x1b[0m", "⚡ Starting OMSUN Frontend (Vite) & Backend (Express API)...");

// 1. Start Backend API
const api = spawn(npmCmd, ["run", "dev"], {
  cwd: serverDir,
  shell: true,
  stdio: "pipe",
});

api.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[32m[API]\x1b[0m ${data}`);
});
api.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[API ERR]\x1b[0m ${data}`);
});

// 2. Start Frontend Vite
const frontend = spawn(npmCmd, ["run", "dev"], {
  cwd: rootDir,
  shell: true,
  stdio: "pipe",
});

frontend.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[36m[FRONTEND]\x1b[0m ${data}`);
});
frontend.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[33m[FRONTEND]\x1b[0m ${data}`);
});

// Handle exit / kill child processes
const cleanup = () => {
  console.log("\n\x1b[33m%s\x1b[0m", "Stopping frontend and backend servers...");
  try {
    api.kill();
    frontend.kill();
  } catch {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
