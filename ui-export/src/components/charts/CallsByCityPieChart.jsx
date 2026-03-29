import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Pie, PieChart } from "recharts";

const PIE_COLORS = [
  "#3f8cf6",
  "#2cbf75",
  "#f0a533",
  "#8e65f2",
  "#e05271",
  "#20b6d8",
];
const MAX_CITY_SEGMENTS = 5;

export default function CallsByCityPieChart({ data, className }) {
  const sortedRows = Array.isArray(data)
    ? [...data].sort((a, b) => b.calls - a.calls || a.city.localeCompare(b.city))
    : [];

  const topRows = sortedRows.slice(0, MAX_CITY_SEGMENTS);
  const otherCalls = sortedRows
    .slice(MAX_CITY_SEGMENTS)
    .reduce((sum, row) => sum + row.calls, 0);

  const mergedRows =
    otherCalls > 0
      ? [...topRows, { city: "Others", calls: otherCalls }]
      : topRows;

  const totalCalls = mergedRows.reduce((sum, row) => sum + row.calls, 0);
  const chartData = mergedRows.map((row, index) => ({
    ...row,
    percentage: totalCalls > 0 ? (row.calls / totalCalls) * 100 : 0,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));

  const chartConfig = {
    calls: {
      label: "Calls",
      color: "var(--chart-2)",
    },
  };

  return (
    <Card
      className={cn(
        "border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold text-foreground">
          Calls by City
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground/80">No city data available.</p>
        ) : (
          <div className="space-y-3">
            <ChartContainer config={chartConfig} className="h-44 w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${value} calls`, "Volume"]}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="calls"
                  nameKey="city"
                  innerRadius={38}
                  outerRadius={70}
                  cornerRadius={4}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {chartData.map((item) => (
                <div key={item.city} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="max-w-[88px] truncate text-muted-foreground">
                    {item.city}
                  </span>
                  <span className="ml-auto font-medium text-foreground">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
