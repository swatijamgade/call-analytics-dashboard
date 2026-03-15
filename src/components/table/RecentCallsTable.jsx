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

export default function RecentCallsTable({ records }) {
  const rows = Array.isArray(records) ? records : [];

  return (
    <Card className="border-border bg-card shadow-sm dark:border-border/70 dark:bg-card/90 dark:shadow-[0_14px_34px_rgba(1,8,26,0.42)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Recent Call Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-auto rounded-md border border-border/70">
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.callerName || "N/A"}</TableCell>
                <TableCell>{row.callerNumber || "N/A"}</TableCell>
                <TableCell>{row.receiverNumber || "N/A"}</TableCell>
                <TableCell>{row.city || "Unknown"}</TableCell>
                <TableCell>{formatDuration(row.callDuration)}</TableCell>
                <TableCell>{formatCurrency(row.callCost)}</TableCell>
                <TableCell>{formatDateTime(row.callStartTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
