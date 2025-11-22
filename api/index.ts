import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "../server/storage";
import { analyzeHealthDocument } from "../server/gemini";
import type { InsertHealthReport, InsertHealthAnalysis } from "@shared/schema";

const app = express();

// Middleware
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Configure multer for temporary storage
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for Vercel
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed."));
    }
  },
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Upload report
app.post("/api/reports/upload", upload.single("file"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save file temporarily to /tmp for analysis
    const tmpDir = "/tmp/uploads";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filePath = path.join(tmpDir, uniqueSuffix + path.extname(req.file.originalname));

    // Write buffer to file
    fs.writeFileSync(filePath, req.file.buffer);

    const reportData: InsertHealthReport = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: filePath,
    };

    const report = await storage.createHealthReport(reportData);

    res.status(201).json({ reportId: report.id, message: "Report uploaded successfully" });

    // Analyze in background (non-blocking)
    setImmediate(async () => {
      try {
        console.log(`Starting analysis for report ${report.id}`);
        const analysis = await analyzeHealthDocument(filePath, req.file.mimetype);

        const analysisData: InsertHealthAnalysis = {
          reportId: report.id,
          lifeScore: analysis.lifeScore,
          metrics: analysis.metrics,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
          summary: analysis.summary,
        };

        await storage.createHealthAnalysis(analysisData);
        console.log(`Analysis completed successfully for report ${report.id}`);

        // Clean up temp file
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete temp file:", e);
        }
      } catch (error) {
        console.error(`Fatal error analyzing report ${report.id}:`, error);

        const fallbackAnalysis: InsertHealthAnalysis = {
          reportId: report.id,
          lifeScore: 50,
          metrics: [],
          insights: [{
            category: "Error",
            title: "Analysis Error",
            description: "Unable to analyze document at this time",
            severity: "high"
          }],
          recommendations: [{
            category: "general",
            title: "Please Re-upload",
            actions: ["Try uploading the document again", "Ensure the document is clear and readable"],
            priority: "medium"
          }],
          summary: "Analysis could not be completed. Please try again.",
        };

        try {
          await storage.createHealthAnalysis(fallbackAnalysis);
          console.log(`Stored fallback analysis for report ${report.id}`);
        } catch (dbError) {
          console.error(`Failed to store fallback analysis for report ${report.id}:`, dbError);
        }

        // Clean up temp file
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete temp file:", e);
        }
      }
    });
  } catch (error) {
    console.error("Error uploading report:", error);
    res.status(500).json({ error: "Failed to upload report" });
  }
});

// Get all reports
app.get("/api/reports", async (_req, res) => {
  try {
    const reports = await storage.getAllHealthReports();
    const reportsWithAnalyses = await Promise.all(
      reports.map(async (report) => {
        const analysis = await storage.getHealthAnalysis(report.id);
        return {
          ...report,
          analysis
        };
      })
    );
    res.json(reportsWithAnalyses);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Get single report
app.get("/api/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await storage.getHealthReport(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    const analysis = await storage.getHealthAnalysis(id);
    res.json({
      ...report,
      analysis
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// Export handler for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
