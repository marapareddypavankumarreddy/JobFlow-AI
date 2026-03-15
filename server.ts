import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "JobFlow AI Backend is running." });
  });

  // Mock Automation Engine
  // In a real app, this would use Playwright or APIs to fetch jobs and store them in Firestore
  const runAutomation = async () => {
    console.log("[Automation Engine] Running daily job search...");
    // Simulate scraping logic
    // 1. Fetch jobs from portals
    // 2. Filter based on user preferences
    // 3. Store in Firestore 'jobs' collection
    console.log("[Automation Engine] Job search complete. 15 new jobs found.");
  };

  // Run automation every 24 hours (simulated)
  setInterval(runAutomation, 24 * 60 * 60 * 1000);
  runAutomation(); // Run once on startup

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
