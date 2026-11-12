import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmptyState } from "./states";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  /** Hide below this breakpoint. */
  hideBelow?: "sm" | "md" | "lg";
}

const hide = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

/**
 * Generic data table with client-side pagination.
 * On mobile, pass `mobileRow` to render a list instead of a table.
 */
export function DataTable<T>({
  rows, columns, getRowId, onRowClick, pageSize = 8, mobileRow, empty, className,
}: {
  rows: T[]; columns: Column<T>[]; getRowId: (r: T) => string; onRowClick?: (r: T) => void; pageSize?: number;
  mobileRow?: (r: T) => ReactNode; empty?: ReactNode; className?: string;
}) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  useEffect(() => setPage(0), [rows.length]);
  const visible = useMemo(() => rows.slice(page * pageSize, page * pageSize + pageSize), [rows, page, pageSize]);

  if (rows.length === 0) return <>{empty ?? <EmptyState title="Nothing here yet" description="Try adjusting your search or filters." />}</>;

  return (
    <div className={cn("surface overflow-hidden", className)}>
      {mobileRow && (
        <ul className="divide-y md:hidden">
          {visible.map((r) => (
            <li key={getRowId(r)}>
              <button type="button" className="w-full px-4 py-3 text-left hover:bg-muted/50" onClick={() => onRowClick?.(r)}>
                {mobileRow(r)}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className={cn("overflow-x-auto", mobileRow && "hidden md:block")}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-4 py-2.5 text-left text-label text-muted-foreground", c.hideBelow && hide[c.hideBelow], c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map((r) => (
              <tr
                key={getRowId(r)}
                onClick={() => onRowClick?.(r)}
                className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-muted/40")}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3 align-middle", c.hideBelow && hide[c.hideBelow], c.className)}>
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pages={pages} total={rows.length} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}

export function Pagination({
  page, pages, total, pageSize, onChange,
}: { page: number; pages: number; total: number; pageSize: number; onChange: (p: number) => void }) {
  const from = page * pageSize + 1;
  const to = Math.min(total, from + pageSize - 1);
  return (
    <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-small text-muted-foreground">
      <span>
        <span className="font-semibold text-foreground">{from}–{to}</span> of {total}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        {Array.from({ length: pages }).map((_, i) => (
          <Button key={i} variant={i === page ? "ink" : "ghost"} size="icon-sm" onClick={() => onChange(i)} aria-label={`Page ${i + 1}`} aria-current={i === page}>
            {i + 1}
          </Button>
        ))}
        <Button variant="outline" size="icon-sm" disabled={page >= pages - 1} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
