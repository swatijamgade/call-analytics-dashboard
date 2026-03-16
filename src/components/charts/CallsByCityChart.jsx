import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function CallsByCityChart({ data }) {
  const chartData = Array.isArray(data) ? data.slice(0, 10) : [];
  const chartConfig = {
    calls: {
      label: "Calls",
      color: "var(--chart-2)",
    },
  };

  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Calls by City (Bar)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground/80">No city data available.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={chartData} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="city"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-20}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `City: ${label}`}
                    formatter={(value) => [`${value} calls`, "Volume"]}
                  />
                }
              />
              <Bar dataKey="calls" fill="var(--color-calls)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
