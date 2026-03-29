import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import { CheckCircle2, CircleX, Clock3, Phone, Wallet } from "lucide-react";

export default function KpiCards({ kpis }) {
  const items = [
    {
      label: "Total Calls",
      value: Number(kpis.totalCalls).toLocaleString("en-US"),
      tone: "var(--chart-1)",
      icon: Phone,
    },
    {
      label: "Total Call Cost",
      value: formatCurrency(kpis.totalCallCost),
      tone: "var(--chart-2)",
      icon: Wallet,
    },
    {
      label: "Average Call Duration",
      value: formatDuration(kpis.averageCallDuration),
      tone: "var(--chart-3)",
      icon: Clock3,
    },
    {
      label: "Total Successful Calls",
      value: Number(kpis.successfulCalls).toLocaleString("en-US"),
      tone: "var(--chart-2)",
      icon: CheckCircle2,
    },
    {
      label: "Total Failed Calls",
      value: Number(kpis.failedCalls).toLocaleString("en-US"),
      tone: "var(--chart-5)",
      icon: CircleX,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]"
          >
            <CardHeader className="pb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="grid size-6 place-content-center rounded-full text-white"
                  style={{ backgroundColor: item.tone }}
                >
                  <Icon className="size-3.5" />
                </span>
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {item.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {item.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
