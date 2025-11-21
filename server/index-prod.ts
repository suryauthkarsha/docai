import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  // Try multiple possible paths for the built files
  let distPath = path.resolve(import.meta.dirname, "public");
  
  // For Vercel and other deployments, check relative paths
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  }
  
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(process.cwd(), "dist", "public");
  }

  // Check if dist directory exists, if not just start the API
  if (!fs.existsSync(distPath)) {
    console.warn(`Build directory not found at ${distPath}, serving API only`);
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
}

(async () => {
  await runApp(serveStatic);
})();
