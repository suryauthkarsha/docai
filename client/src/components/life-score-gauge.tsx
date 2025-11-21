import { Card } from "@/components/ui/card";

interface LifeScoreGaugeProps {
  score: number;
}

export function LifeScoreGauge({ score }: LifeScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(var(--chart-3))";
    if (score >= 60) return "hsl(var(--chart-2))";
    if (score >= 40) return "hsl(var(--chart-1))";
    return "hsl(var(--destructive))";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-8 flex flex-col items-center justify-center">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold" data-testid="text-life-score">
            {score}
          </div>
          <div className="text-lg text-muted-foreground mt-2">Life Score</div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-xl font-semibold" style={{ color: getScoreColor(score) }}>
          {getScoreLabel(score)}
        </div>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Your overall health score based on analyzed biomarkers and health indicators
        </p>
      </div>
    </Card>
  );
}
