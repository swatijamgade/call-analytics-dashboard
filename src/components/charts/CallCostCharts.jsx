import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/formatters";

const COST_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function CallCostCharts({ data }) {
  const chartData = Array.isArray(data)
    ? data.slice(0, 5).map((row, index) => ({
        ...row,
        fill: COST_COLORS[index % COST_COLORS.length],
      }))
    : [];
  const costConfig = {
    totalCost: {
      label: "Total Cost",
      color: "var(--chart-1)",
    },
    averageCost: {
      label: "Avg Cost / Call",
      color: "#7b8ea8",
    },
  };

  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Call Cost Analysis
          </CardTitle>
          <p className="text-xs font-medium text-muted-foreground">Avg Cost / Call</p>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground/80">No cost data available.</p>
        ) : (
          <ChartContainer config={costConfig} className="h-48 w-full">
            <ComposedChart data={chartData} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="city"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === "averageCost") {
                        return [formatCurrency(value), "Avg Cost / Call"];
                      }
                      return [formatCurrency(value), "Total Cost"];
                    }}
                  />
                }
              />
              <Bar dataKey="totalCost" radius={6}>
                {chartData.map((row) => (
                  <Cell key={row.city} fill={row.fill} />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="averageCost"
                stroke="var(--color-averageCost)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
