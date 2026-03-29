import { useEffect, useMemo, useState } from "react";
import KpiCards from "./components/dashboard/KpiCards";
import CallActivityChart from "./components/charts/CallActivityChart";
import CallCostCharts from "./components/charts/CallCostCharts";
import CallDurationChart from "./components/charts/CallDurationChart";
import CallsByCityPieChart from "./components/charts/CallsByCityPieChart";
import RecentCallsTable from "./components/table/RecentCallsTable";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { CalendarDays, PhoneCall, Sun, TimerReset } from "lucide-react";
import { formatDuration } from "./lib/formatters";
import { fetchCdrRecords } from "./services/cdrApi";
import {
  calculateKpis,
  getCallsByCity,
  getCallsPerDay,
  getCallsPerHour,
  getCostByCity,
  getDurationStats,
} from "./utils/analytics";

function MiniMetric({ label, value, subtitle, icon, tone }) {
  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardContent className="flex items-center justify-between gap-3 pt-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className="grid size-9 place-content-center rounded-lg text-white"
          style={{ backgroundColor: tone }}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [datasetSizeDisplay, setDatasetSizeDisplay] = useState("All");
  const [isEditingDatasetSize, setIsEditingDatasetSize] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const controller = new AbortController();

    fetchCdrRecords(controller.signal)
      .then((rows) => {
        setRecords(rows);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load CDR records");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const sortedRecords = useMemo(
    () =>
      [...records].sort(
        (a, b) =>
          new Date(b.callStartTime).getTime() - new Date(a.callStartTime).getTime(),
      ),
    [records],
  );

  const dateBounds = useMemo(() => {
    let min = "";
    let max = "";

    for (const row of sortedRecords) {
      const parsed = new Date(row.callStartTime);
      if (Number.isNaN(parsed.getTime())) continue;

      const dateKey = parsed.toISOString().slice(0, 10);
      if (!min || dateKey < min) min = dateKey;
      if (!max || dateKey > max) max = dateKey;
    }

    return { min, max };
  }, [sortedRecords]);

  const filteredByDateRecords = useMemo(
    () =>
      sortedRecords.filter((row) => {
        const parsed = new Date(row.callStartTime);
        if (Number.isNaN(parsed.getTime())) return false;

        const dateKey = parsed.toISOString().slice(0, 10);
        if (startDate && dateKey < startDate) return false;
        if (endDate && dateKey > endDate) return false;
        return true;
      }),
    [endDate, sortedRecords, startDate],
  );

  const cityOptions = useMemo(() => {
    const unique = new Set();
    filteredByDateRecords.forEach((row) => unique.add(row.city || "Unknown"));
    return [...unique].sort((a, b) => String(a).localeCompare(String(b)));
  }, [filteredByDateRecords]);

  const cityFilterValue =
    selectedCity === "All" || cityOptions.includes(selectedCity) ? selectedCity : "All";

  const filteredRecords = useMemo(() => {
    if (cityFilterValue === "All") return filteredByDateRecords;
    return filteredByDateRecords.filter((row) => (row.city || "Unknown") === cityFilterValue);
  }, [cityFilterValue, filteredByDateRecords]);

  const selectedDatasetSize = useMemo(() => {
    const maxAvailable = filteredRecords.length;
    if (maxAvailable === 0) return 0;

    const normalizedDisplay = datasetSizeDisplay.trim().toLowerCase();
    if (!normalizedDisplay || normalizedDisplay === "all") {
      return maxAvailable;
    }

    const parsed = Number.parseInt(datasetSizeDisplay.replaceAll(",", ""), 10);
    if (!Number.isFinite(parsed)) return maxAvailable;
    return Math.max(1, Math.min(parsed, maxAvailable));
  }, [datasetSizeDisplay, filteredRecords.length]);

  const scopedRecords = useMemo(
    () => filteredRecords.slice(0, selectedDatasetSize),
    [filteredRecords, selectedDatasetSize],
  );

  const kpis = useMemo(() => calculateKpis(scopedRecords), [scopedRecords]);
  const durationStats = useMemo(() => getDurationStats(scopedRecords), [scopedRecords]);
  const costByCity = useMemo(() => getCostByCity(scopedRecords), [scopedRecords]);
  const callsByCity = useMemo(() => getCallsByCity(scopedRecords), [scopedRecords]);
  const callsPerHour = useMemo(() => getCallsPerHour(scopedRecords), [scopedRecords]);
  const callsPerDay = useMemo(() => getCallsPerDay(scopedRecords), [scopedRecords]);
  const recentCalls = useMemo(() => scopedRecords, [scopedRecords]);
  const latestDay = callsPerDay.at(-1);
  const isAllSelected =
    selectedDatasetSize === filteredRecords.length &&
    (!datasetSizeDisplay.trim() || datasetSizeDisplay.trim().toLowerCase() === "all");
  const resolvedDatasetSize = isAllSelected
    ? "All"
    : selectedDatasetSize.toLocaleString("en-US");

  const normalizeDatasetSize = () => {
    const maxAvailable = filteredRecords.length;
    if (maxAvailable === 0) {
      setDatasetSizeDisplay("0");
      setIsEditingDatasetSize(false);
      return;
    }

    const normalizedDisplay = datasetSizeDisplay.trim().toLowerCase();
    if (!normalizedDisplay || normalizedDisplay === "all") {
      setDatasetSizeDisplay("All");
      setIsEditingDatasetSize(false);
      return;
    }

    const numeric = Number.parseInt(datasetSizeDisplay.replaceAll(",", ""), 10);
    if (Number.isFinite(numeric) && numeric > 0) {
      const clamped = Math.min(numeric, maxAvailable);
      setDatasetSizeDisplay(clamped.toLocaleString("en-US"));
    } else {
      setDatasetSizeDisplay(maxAvailable.toLocaleString("en-US"));
    }
    setIsEditingDatasetSize(false);
  };

  if (error) {
    return (
      <main className="grid min-h-screen place-content-center bg-background p-6">
        <p className="rounded-lg border border-rose-300 bg-rose-100 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/30 dark:text-rose-100">
          {error}
        </p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-content-center bg-background p-6">
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Loading call records...
        </p>
      </main>
    );
  }

  if (!records.length) {
    return (
      <main className="grid min-h-screen place-content-center bg-background p-6">
        <p className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          No call records were returned by the API.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-5">
      <div className="mx-auto max-w-[1280px] space-y-3">
        <header className="overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_18px_40px_rgba(1,8,26,0.45)]">
          <div className="grid items-center gap-2 bg-[#25456b] px-3 py-2 text-white sm:grid-cols-[1fr_auto_1fr] dark:bg-[#10284f]">
            <span aria-hidden="true" />
            <p className="text-base sm:text-lg font-semibold text-white/95">
              Call Analytics Dashboard
            </p>
            <div className="flex items-center justify-end gap-2">
              <div className="hidden items-center gap-1 rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-medium text-white/90 sm:flex">
                <span>Dataset Size:</span>
                {isEditingDatasetSize ? (
                  <input
                    autoFocus
                    value={datasetSizeDisplay}
                    onChange={(event) =>
                      setDatasetSizeDisplay(event.target.value.replace(/[^0-9,]/g, ""))
                    }
                    onBlur={normalizeDatasetSize}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") normalizeDatasetSize();
                      if (event.key === "Escape") {
                        setDatasetSizeDisplay("All");
                        setIsEditingDatasetSize(false);
                      }
                    }}
                    className="w-20 rounded border border-white/25 bg-white/20 px-1 py-0.5 text-xs text-white placeholder:text-white/70 focus:outline-none"
                    aria-label="Dataset size"
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          !datasetSizeDisplay.trim() ||
                          datasetSizeDisplay.trim().toLowerCase() === "all"
                        ) {
                          setDatasetSizeDisplay(
                            filteredRecords.length.toLocaleString("en-US"),
                          );
                        }
                        setIsEditingDatasetSize(true);
                      }}
                      className="rounded px-1 text-xs text-white/95 hover:bg-white/15"
                    >
                      {resolvedDatasetSize} Records
                    </button>
                    <button
                      type="button"
                      onClick={() => setDatasetSizeDisplay("All")}
                      className="rounded px-1 text-xs text-white/95 hover:bg-white/15"
                    >
                      All
                    </button>
                  </>
                )}
              </div>
              <Button
                size="xs"
                onClick={() =>
                  setTheme((currentTheme) =>
                    currentTheme === "dark" ? "light" : "dark",
                  )
                }
                className="h-7 border border-white/35 bg-white/10 px-2 text-xs font-medium text-white hover:bg-white/20"
              >
                <Sun className="size-3.5" />
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2 border-t border-border/80 px-3 py-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">City</span>
              <select
                value={cityFilterValue}
                onChange={(event) => setSelectedCity(event.target.value)}
                className="h-8 min-w-36 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-ring"
              >
                <option value="All">All Cities</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">From</span>
              <input
                type="date"
                value={startDate}
                min={dateBounds.min}
                max={endDate || dateBounds.max}
                onChange={(event) => {
                  const nextStart = event.target.value;
                  setStartDate(nextStart);
                  if (endDate && nextStart && endDate < nextStart) {
                    setEndDate(nextStart);
                  }
                }}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-ring"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">To</span>
              <input
                type="date"
                value={endDate}
                min={startDate || dateBounds.min}
                max={dateBounds.max}
                onChange={(event) => {
                  const nextEnd = event.target.value;
                  setEndDate(nextEnd);
                  if (startDate && nextEnd && nextEnd < startDate) {
                    setStartDate(nextEnd);
                  }
                }}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-ring"
              />
            </label>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedCity("All");
              }}
              className="h-8 px-2"
            >
              Reset Filters
            </Button>
            <p className="ml-auto pb-1 text-xs font-medium text-muted-foreground">
              {filteredRecords.length.toLocaleString("en-US")} records in range
            </p>
          </div>
        </header>

        <section className="space-y-3">
          <KpiCards kpis={kpis} />

          <div className="grid gap-3 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <CallDurationChart stats={durationStats} />
            </div>
            <div className="xl:col-span-5">
              <CallCostCharts data={costByCity} />
            </div>
            <div className="xl:col-span-4">
              <CallActivityChart hourlyData={callsPerHour} dailyData={callsPerDay} />
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-12">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:col-span-9 xl:grid-cols-1">
              <MiniMetric
                label="Longest Call"
                value={formatDuration(durationStats.longestCallDuration)}
                subtitle="Highest call duration"
                icon={<PhoneCall className="size-4.5" />}
                tone="#3f8cf6"
              />
              <MiniMetric
                label="Shortest Call"
                value={formatDuration(durationStats.shortestCallDuration)}
                subtitle="Minimum connected call"
                icon={<TimerReset className="size-4.5" />}
                tone="#2cbf75"
              />
              <MiniMetric
                label="Daily Activity"
                value={`${(latestDay?.calls ?? 0).toLocaleString("en-US")}`}
                subtitle={latestDay ? `Calls on ${latestDay.day}` : "Latest day"}
                icon={<CalendarDays className="size-4.5" />}
                tone="#f0a533"
              />
            </div>
            <div className="xl:col-span-3">
              <CallsByCityPieChart data={callsByCity} className="xl:h-full" />
            </div>
          </div>

          <RecentCallsTable records={recentCalls} />
        </section>
      </div>
    </main>
  );
}
