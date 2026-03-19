import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

function percentage(part, total) {
  if (!total) return 0;
  return (part / total) * 100;
}

export default function CallStatusCard({ kpis }) {
  const chartData = [
    {
      name: "Successful",
      value: kpis.successfulCalls,
      fill: "var(--chart-2)",
    },
    {
      name: "Failed",
      value: kpis.failedCalls,
      fill: "var(--chart-5)",
    },
  ];

  const chartConfig = {
    successful: { label: "Successful", color: "var(--chart-2)" },
    failed: { label: "Failed", color: "var(--chart-5)" },
  };

  const successRate = percentage(kpis.successfulCalls, kpis.totalCalls);
  const failRate = percentage(kpis.failedCalls, kpis.totalCalls);

  return (
    <Card className="border-border/70 bg-card/90 shadow-[0_14px_34px_rgba(1,8,26,0.42)] backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Call Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative mx-auto max-w-[280px]">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      Number(value).toLocaleString("en-US"),
                      name,
                    ]}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={84}
                strokeWidth={6}
                cornerRadius={8}
              />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p className="text-3xl font-semibold text-foreground">
              {successRate.toFixed(1)}%
            </p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
              success rate
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-muted p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Successful calls</span>
            <span className="font-semibold text-foreground">
              {kpis.successfulCalls.toLocaleString("en-US")} ({successRate.toFixed(1)}
              %)
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Failed calls</span>
            <span className="font-semibold text-foreground">
              {kpis.failedCalls.toLocaleString("en-US")} ({failRate.toFixed(1)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
