import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

export default function CallActivityChart({ hourlyData, dailyData }) {
  const byHour = Array.isArray(hourlyData)
    ? hourlyData.filter((row) => row.hour % 2 === 0)
    : [];
  const chartConfig = {
    calls: {
      label: "Calls",
      color: "var(--chart-1)",
    },
  };
  void dailyData;

  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Call Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {byHour.length === 0 ? (
          <p className="text-sm text-muted-foreground/80">No timeline data available.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <LineChart data={byHour} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={(label) => `Hour: ${label}`} />}
              />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="var(--color-calls)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
