import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileText, Calendar, TrendingUp, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { HealthReport, HealthAnalysis } from "@shared/schema";

interface ReportWithAnalysis extends HealthReport {
  analysis?: HealthAnalysis;
}

export default function History() {
  const { data: reports, isLoading } = useQuery<ReportWithAnalysis[]>({
    queryKey: ["/api/reports"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Report History</h1>
          <p className="text-muted-foreground">
            View all your uploaded health reports and their analyses
          </p>
        </div>

        {!reports || reports.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Reports Yet</h2>
            <p className="text-muted-foreground mb-8">
              Upload your first health report to get started
            </p>
            <Link href="/">
              <Button size="lg" data-testid="button-upload-first">
                Upload Report
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Link key={report.id} href={`/report/${report.id}`}>
                <Card className="p-6 hover-elevate cursor-pointer" data-testid={`card-report-${report.id}`}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-2 truncate">
                        {report.fileName}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(report.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        {report.analysis && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Life Score: {report.analysis.lifeScore}</span>
                          </div>
                        )}
                      </div>
                      
                      {report.analysis && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.analysis.summary}
                        </p>
                      )}
                      
                      {!report.analysis && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-500">
                          Analysis in progress...
                        </p>
                      )}
                    </div>

                    {report.analysis && (
                      <div className="flex-shrink-0 text-right">
                        <div className="text-3xl font-bold text-primary">
                          {report.analysis.lifeScore}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          / 100
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
