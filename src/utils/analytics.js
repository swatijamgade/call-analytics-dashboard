function toNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeRecords(records) {
  return Array.isArray(records) ? records : [];
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortByCountThenName(a, b, key = "name", countKey = "count") {
  return b[countKey] - a[countKey] || String(a[key]).localeCompare(String(b[key]));
}

export function calculateKpis(records) {
  const rows = safeRecords(records);
  const totalCalls = rows.length;

  const totalCallDuration = rows.reduce(
    (sum, row) => sum + toNumber(row.callDuration),
    0,
  );
  const totalCallCost = rows.reduce((sum, row) => sum + toNumber(row.callCost), 0);
  const successfulCalls = rows.filter((row) => row.callStatus === true).length;
  const failedCalls = rows.filter((row) => row.callStatus === false).length;

  return {
    totalCalls,
    totalCallDuration,
    totalCallCost,
    averageCallDuration: totalCalls > 0 ? totalCallDuration / totalCalls : 0,
    averageCostPerCall: totalCalls > 0 ? totalCallCost / totalCalls : 0,
    successfulCalls,
    failedCalls,
  };
}

export function getDurationStats(records) {
  const rows = safeRecords(records);
  if (rows.length === 0) {
    return {
      longestCallDuration: 0,
      shortestCallDuration: 0,
      averageCallDuration: 0,
    };
  }

  const durations = rows.map((row) => toNumber(row.callDuration));
  const total = durations.reduce((sum, value) => sum + value, 0);

  return {
    longestCallDuration: Math.max(...durations),
    shortestCallDuration: Math.min(...durations),
    averageCallDuration: total / durations.length,
  };
}

export function getCallsByCity(records) {
  const rows = safeRecords(records);
  const callsByCity = rows.reduce((acc, row) => {
    const city = row.city || "Unknown";
    acc[city] = (acc[city] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(callsByCity)
    .map(([city, calls]) => ({ city, calls }))
    .sort((a, b) => sortByCountThenName(a, b, "city", "calls"));
}

export function getCostByCity(records) {
  const rows = safeRecords(records);
  const costByCity = rows.reduce((acc, row) => {
    const city = row.city || "Unknown";
    if (!acc[city]) {
      acc[city] = { totalCost: 0, calls: 0 };
    }
    acc[city].totalCost += toNumber(row.callCost);
    acc[city].calls += 1;
    return acc;
  }, {});

  return Object.entries(costByCity)
    .map(([city, data]) => ({
      city,
      totalCost: data.totalCost,
      averageCost: data.calls > 0 ? data.totalCost / data.calls : 0,
      calls: data.calls,
    }))
    .sort((a, b) => sortByCountThenName(a, b, "city", "totalCost"));
}

export function getCallsPerHour(records) {
  const rows = safeRecords(records);
  const perHour = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    label: `${String(hour).padStart(2, "0")}:00`,
    calls: 0,
  }));

  rows.forEach((row) => {
    const date = parseDate(row.callStartTime);
    if (!date) return;
    const hour = date.getUTCHours();
    perHour[hour].calls += 1;
  });

  return perHour;
}

export function getCallsPerDay(records) {
  const rows = safeRecords(records);
  const callsPerDay = rows.reduce((acc, row) => {
    const date = parseDate(row.callStartTime);
    if (!date) return acc;

    const day = date.toISOString().slice(0, 10);
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(callsPerDay)
    .map(([day, calls]) => ({ day, calls }))
    .sort((a, b) => a.day.localeCompare(b.day));
}
