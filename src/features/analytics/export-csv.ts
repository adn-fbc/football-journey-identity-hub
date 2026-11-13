import { toast } from "sonner";
import { toCsv, type ExportRow } from "./analytics-model";

/** Downloads the given rows as CSV in the browser. */
export function downloadCsv(rows: ExportRow[], filename: string) {
  try {
    const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("CSV exported", { description: "Same numbers as on screen. No names or contact details." });
  } catch {
    toast.error("Export failed", { description: "Please try again." });
  }
}
