const CDR_API_URL = "https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr";

function toNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeRecord(row = {}) {
  return {
    id: String(row.id ?? ""),
    callerName: row.callerName ?? "",
    callerNumber: row.callerNumber ?? "",
    receiverNumber: row.receiverNumber ?? "",
    city: row.city ?? "Unknown",
    callDirection: Boolean(row.callDirection),
    callStatus: Boolean(row.callStatus),
    callDuration: toNumber(row.callDuration),
    callCost: toNumber(row.callCost),
    callStartTime: row.callStartTime ?? null,
    callEndTime: row.callEndTime ?? null,
  };
}

export async function fetchCdrRecords() {
  const response = await fetch(CDR_API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CDR data: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("CDR API returned a non-array payload.");
  }

  return data.map(normalizeRecord);
}
