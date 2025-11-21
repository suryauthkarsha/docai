import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, Activity, AlertCircle, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeScoreGauge } from "@/components/life-score-gauge";
import type { HealthReport, HealthAnalysis } from "@shared/schema";

interface ReportWithAnalysis extends HealthReport {
  analysis?: HealthAnalysis;
}

export default function ReportDetail() {
  const [, params] = useRoute("/report/:id");
  const reportId = params?.id;

  const { data: report, isLoading, refetch } = useQuery<ReportWithAnalysis>({
    queryKey: ["report", reportId],
    queryFn: async () => {
      const response = await fetch(`/api/reports/${reportId}`);
      if (!response.ok) throw new Error("Failed to fetch report");
      return response.json();
    },
    enabled: !!reportId,
    refetchInterval: (query) => {
      const data = query.state.data as ReportWithAnalysis | undefined;
      return data?.analysis ? false : 3000;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Report Not Found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const analysis = report.analysis;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case "attention":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "attention":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      diet: Activity,
      exercise: TrendingUp,
      sleep: Calendar,
      stress: AlertCircle,
      general: CheckCircle2,
    };
    const IconComponent = iconMap[category] || Activity;
    return <IconComponent className="h-6 w-6 text-primary" />;
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-8" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="text-center py-16">
            <Activity className="h-24 w-24 text-muted-foreground mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold mb-4">Analysis in Progress</h2>
            <p className="text-muted-foreground">
              Your health report is being analyzed. This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const metricsByCategory = analysis.metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof analysis.metrics>);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{report.fileName}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(report.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <LifeScoreGauge score={analysis.lifeScore} />
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 h-full">
              <h2 className="text-2xl font-semibold mb-4">Analysis Summary</h2>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.summary}
              </p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Health Metrics</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {Object.entries(metricsByCategory).map(([category, metrics]) => (
                <AccordionItem key={category} value={category} className="border-none">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover-elevate">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="font-semibold capitalize">{category}</span>
                        <Badge variant="secondary" className="ml-2">
                          {metrics.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        {metrics.map((metric, index) => (
                          <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(metric.status)}
                                <span className="font-medium">{metric.name}</span>
                              </div>
                              <Badge className={getStatusColor(metric.status)}>
                                {metric.status}
                              </Badge>
                            </div>
                            <div className="ml-7 space-y-1">
                              <p className="text-sm">
                                <span className="font-semibold">Your Value:</span> {metric.value} {metric.unit}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Normal Range:</span> {metric.normalRange}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Personalized Recommendations</h2>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <Card key={index} className="p-6" data-testid={`card-recommendation-${index}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(rec.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{rec.title}</h3>
                        <Badge
                          variant={rec.priority === "high" ? "destructive" : "secondary"}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <ul className="space-y-2">
                        {rec.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {analysis.insights.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Key Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.insights.map((insight, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      insight.severity === "high"
                        ? "text-red-600"
                        : insight.severity === "medium"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`} />
                    <div>
                      <h3 className="font-semibold mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
