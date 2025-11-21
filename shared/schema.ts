import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const healthReports = pgTable("health_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const healthAnalyses = pgTable("health_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").notNull().references(() => healthReports.id, { onDelete: 'cascade' }),
  lifeScore: integer("life_score").notNull(),
  analysisDate: timestamp("analysis_date").notNull().defaultNow(),
  metrics: jsonb("metrics").$type<HealthMetric[]>().notNull(),
  insights: jsonb("insights").$type<HealthInsight[]>().notNull(),
  recommendations: jsonb("recommendations").$type<Recommendation[]>().notNull(),
  summary: text("summary").notNull(),
});

export const insertHealthReportSchema = createInsertSchema(healthReports).omit({
  id: true,
  uploadedAt: true,
});

export const insertHealthAnalysisSchema = createInsertSchema(healthAnalyses).omit({
  id: true,
  analysisDate: true,
});

export type InsertHealthReport = z.infer<typeof insertHealthReportSchema>;
export type HealthReport = typeof healthReports.$inferSelect;
export type InsertHealthAnalysis = z.infer<typeof insertHealthAnalysisSchema>;
export type HealthAnalysis = typeof healthAnalyses.$inferSelect;

export interface HealthMetric {
  name: string;
  value: string;
  unit: string;
  status: 'excellent' | 'good' | 'attention' | 'critical';
  normalRange: string;
  category: string;
}

export interface HealthInsight {
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  category: 'diet' | 'exercise' | 'sleep' | 'stress' | 'general';
  title: string;
  actions: string[];
  priority: 'low' | 'medium' | 'high';
}
