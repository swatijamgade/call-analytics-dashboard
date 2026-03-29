import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { formatDuration } from "@/lib/formatters";

const DURATION_COLORS = ["var(--chart-1)", "var(--chart-3)", "var(--chart-4)"];

export default function CallDurationChart({ stats }) {
  const chartData = [
    {
      metric: "Shortest",
      seconds: Number(stats?.shortestCallDuration ?? 0),
      fill: DURATION_COLORS[0],
    },
    {
      metric: "Average",
      seconds: Number(stats?.averageCallDuration ?? 0),
      fill: DURATION_COLORS[1],
    },
    {
      metric: "Longest",
      seconds: Number(stats?.longestCallDuration ?? 0),
      fill: DURATION_COLORS[2],
    },
  ];

  const chartConfig = {
    shortest: {
      label: "Shortest",
      color: DURATION_COLORS[0],
    },
    average: {
      label: "Average",
      color: DURATION_COLORS[1],
    },
    longest: {
      label: "Longest",
      color: DURATION_COLORS[2],
    },
  };

  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-foreground">
          Call Duration Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -14, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="metric" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => [formatDuration(value), "Duration"]}
                />
              }
            />
            <Bar dataKey="seconds" radius={6}>
              {chartData.map((entry) => (
                <Cell key={entry.metric} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
