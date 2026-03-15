const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  const amount = Number(value);
  return usd.format(Number.isFinite(amount) ? amount : 0);
}

export function formatDuration(seconds) {
  const totalSeconds = Number(seconds);
  const safeSeconds = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.round(totalSeconds))
    : 0;

  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
