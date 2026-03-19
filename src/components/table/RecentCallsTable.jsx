import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  formatDateTime,
  formatDuration,
} from "@/lib/formatters";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function RecentCallsTable({ records }) {
  const rows = Array.isArray(records) ? records : [];
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const start = (activePage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRows = rows.slice(start, end);
  const rangeStart = rows.length ? start + 1 : 0;
  const rangeEnd = rows.length ? Math.min(end, rows.length) : 0;

  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="mr-auto text-base md:text-lg font-semibold text-foreground">
            Recent Call Logs
          </CardTitle>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-6 rounded-md border border-border bg-background px-1.5 text-xs text-foreground outline-none focus:border-ring"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <Button
            size="xs"
            variant="outline"
            disabled={activePage <= 1}
            onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
          >
            Previous
          </Button>
          <span className="min-w-20 text-center text-xs text-muted-foreground">
            Page {activePage} / {totalPages}
          </span>
          <Button
            size="xs"
            variant="outline"
            disabled={activePage >= totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
          >
            Next
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {rangeStart}-{rangeEnd} of {rows.length.toLocaleString("en-US")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border border-border/70">
          <Table className="text-xs">
            <TableHeader className="[&_tr]:sticky [&_tr]:top-0 [&_tr]:z-10 [&_tr]:bg-muted">
              <TableRow>
                <TableHead>Caller Name</TableHead>
                <TableHead>Caller Number</TableHead>
                <TableHead>Receiver Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Start Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length ? (
                paginatedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.callerName || "N/A"}</TableCell>
                    <TableCell>{row.callerNumber || "N/A"}</TableCell>
                    <TableCell>{row.receiverNumber || "N/A"}</TableCell>
                    <TableCell>{row.city || "Unknown"}</TableCell>
                    <TableCell>{formatDuration(row.callDuration)}</TableCell>
                    <TableCell>{formatCurrency(row.callCost)}</TableCell>
                    <TableCell>{formatDateTime(row.callStartTime)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-5 text-center text-muted-foreground">
                    No call logs available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
