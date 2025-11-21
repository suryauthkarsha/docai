import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileText, TrendingUp, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LifeScoreGauge } from "@/components/life-score-gauge";
import type { HealthReport, HealthAnalysis } from "@shared/schema";

interface ReportWithAnalysis extends HealthReport {
  analysis?: HealthAnalysis;
}

export default function Dashboard() {
  const { data: reports, isLoading } = useQuery<ReportWithAnalysis[]>({
    queryKey: ["/api/reports"],
  });

  const latestReport = reports?.[0];
  const latestAnalysis = latestReport?.analysis;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Activity className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">No Reports Yet</h2>
          <p className="text-muted-foreground mb-8">
            Upload your first health report to get started with AI-powered insights and personalized recommendations
          </p>
          <Link href="/">
            <Button size="lg" data-testid="button-upload-first">
              <FileText className="mr-2 h-5 w-5" />
              Upload Your First Report
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">
            Track your health metrics and get personalized insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-reports">
                {reports.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Health documents analyzed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-latest-score">
                {latestAnalysis?.lifeScore || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of 100 points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Upload</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReport
                  ? new Date(latestReport.uploadedAt).toLocaleDateString()
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Most recent analysis
              </p>
            </CardContent>
          </Card>
        </div>

        {latestAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <LifeScoreGauge score={latestAnalysis.lifeScore} />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Recent Analysis</h2>
                <Card className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {latestAnalysis.summary}
                  </p>
                  <Link href={`/report/${latestReport.id}`}>
                    <Button className="mt-6" data-testid="button-view-details">
                      View Full Report
                    </Button>
                  </Link>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Metrics Analyzed</div>
                    <div className="text-2xl font-bold">
                      {latestAnalysis.metrics?.length || 0}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Recommendations</div>
                    <div className="text-2xl font-bold">
                      {latestAnalysis.recommendations?.length || 0}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Reports</h2>
            <Link href="/history">
              <Button variant="outline" data-testid="button-view-history">
                View All Reports
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.slice(0, 3).map((report) => (
              <Link key={report.id} href={`/report/${report.id}`}>
                <Card className="p-6 hover-elevate cursor-pointer" data-testid={`card-report-${report.id}`}>
                  <div className="flex items-start gap-4">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate mb-1">{report.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.uploadedAt).toLocaleDateString()}
                      </p>
                      {report.analysis && (
                        <div className="mt-2">
                          <span className="text-sm font-medium">
                            Score: {report.analysis.lifeScore}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
