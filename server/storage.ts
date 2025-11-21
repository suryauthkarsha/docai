import { 
  type HealthReport, 
  type InsertHealthReport,
  type HealthAnalysis,
  type InsertHealthAnalysis,
  healthReports,
  healthAnalyses
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createHealthReport(report: InsertHealthReport): Promise<HealthReport>;
  getHealthReport(id: string): Promise<HealthReport | undefined>;
  getAllHealthReports(): Promise<HealthReport[]>;
  
  createHealthAnalysis(analysis: InsertHealthAnalysis): Promise<HealthAnalysis>;
  getHealthAnalysis(reportId: string): Promise<HealthAnalysis | undefined>;
  getHealthAnalysisById(id: string): Promise<HealthAnalysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createHealthReport(report: InsertHealthReport): Promise<HealthReport> {
    const [created] = await db.insert(healthReports).values(report).returning();
    return created;
  }

  async getHealthReport(id: string): Promise<HealthReport | undefined> {
    const [report] = await db.select().from(healthReports).where(eq(healthReports.id, id));
    return report;
  }

  async getAllHealthReports(): Promise<HealthReport[]> {
    return db.select().from(healthReports).orderBy(desc(healthReports.uploadedAt));
  }

  async createHealthAnalysis(analysis: InsertHealthAnalysis): Promise<HealthAnalysis> {
    const [created] = await db.insert(healthAnalyses).values(analysis).returning();
    return created;
  }

  async getHealthAnalysis(reportId: string): Promise<HealthAnalysis | undefined> {
    const [analysis] = await db.select().from(healthAnalyses).where(eq(healthAnalyses.reportId, reportId));
    return analysis;
  }

  async getHealthAnalysisById(id: string): Promise<HealthAnalysis | undefined> {
    const [analysis] = await db.select().from(healthAnalyses).where(eq(healthAnalyses.id, id));
    return analysis;
  }
}

export const storage = new DatabaseStorage();
