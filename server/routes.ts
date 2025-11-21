import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { analyzeHealthDocument } from "./gemini";
import type { InsertHealthReport, InsertHealthAnalysis } from "@shared/schema";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/reports/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const reportData: InsertHealthReport = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: req.file.path,
      };

      const report = await storage.createHealthReport(reportData);

      res.setHeader('Content-Type', 'application/json');
      res.status(201).json({ reportId: report.id, message: "Report uploaded successfully" });

      setImmediate(async () => {
        try {
          console.log(`Starting analysis for report ${report.id}`);
          const analysis = await analyzeHealthDocument(req.file!.path, req.file!.mimetype);
          
          const analysisData: InsertHealthAnalysis = {
            reportId: report.id,
            lifeScore: analysis.lifeScore,
            metrics: analysis.metrics,
            insights: analysis.insights,
            recommendations: analysis.recommendations,
            summary: analysis.summary,
          };

          await storage.createHealthAnalysis(analysisData);
          console.log(`Analysis completed successfully for report ${report.id} with score ${analysis.lifeScore}`);
        } catch (error) {
          console.error(`Fatal error analyzing report ${report.id}:`, error);
          
          const fallbackAnalysis: InsertHealthAnalysis = {
            reportId: report.id,
            lifeScore: 50,
            metrics: [],
            insights: [],
            recommendations: [],
            summary: "Analysis failed due to a technical error. Please try uploading again.",
          };
          
          try {
            await storage.createHealthAnalysis(fallbackAnalysis);
            console.log(`Stored fallback analysis for report ${report.id}`);
          } catch (dbError) {
            console.error(`Failed to store fallback analysis for report ${report.id}:`, dbError);
          }
        }
      });
    } catch (error) {
      console.error("Error uploading report:", error);
      res.status(500).json({ error: "Failed to upload report" });
    }
  });

  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllHealthReports();
      
      const reportsWithAnalyses = await Promise.all(
        reports.map(async (report) => {
          const analysis = await storage.getHealthAnalysis(report.id);
          return {
            ...report,
            analysis,
          };
        })
      );

      res.json(reportsWithAnalyses);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

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
        analysis,
      });
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
