const DEFAULT_API_URL = "https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr";

const API_URL =
  typeof import.meta.env.VITE_CDR_API_URL === "string" &&
  import.meta.env.VITE_CDR_API_URL.trim().length > 0
    ? import.meta.env.VITE_CDR_API_URL.trim()
    : DEFAULT_API_URL;

function toBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return defaultValue;
}

function parseCallStatus(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      [
        "true",
        "1",
        "success",
        "successful",
        "completed",
        "connected",
        "answered",
      ].includes(normalized)
    ) {
      return true;
    }
    if (
      [
        "false",
        "0",
        "failed",
        "failure",
        "dropped",
        "missed",
        "unanswered",
        "busy",
        "rejected",
      ].includes(normalized)
    ) {
      return false;
    }
  }
  return null;
}

export async function fetchCdrRecords(signal) {
  const response = await fetch(API_URL, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch CDR records");
  }

  const rows = await response.json();

  if (!Array.isArray(rows)) {
    throw new Error("CDR API returned an invalid payload");
  }

  return rows.map((row) => ({
    ...row,
    callDirection: toBoolean(row.callDirection, null),
    callStatus: parseCallStatus(row.callStatus),
    callCost: Number(row.callCost),
    callDuration: Number(row.callDuration),
    callStartTime: new Date(row.callStartTime),
    callEndTime: new Date(row.callEndTime),
  }));
}
