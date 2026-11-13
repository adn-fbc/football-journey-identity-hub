import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Slim banner for "preview" modules: interactive prototype on sample data, linking to its blueprint. */
export function PrototypeNotice({ moduleId, className }: { moduleId: string; className?: string | undefined }) {
  return (
    <div role="note" className={cn("flex flex-col gap-2 rounded-lg border border-info/20 bg-info/5 px-4 py-2.5 text-small sm:flex-row sm:items-center sm:justify-between", className)}>
      <span className="flex items-center gap-2 text-foreground">
        <FlaskConical className="size-4 shrink-0 text-info" />
        Prototype with fictional sample data. Nothing here changes official records.
      </span>
      <Link to="/modules/$moduleId" params={{ moduleId }} className="shrink-0 font-semibold text-primary hover:underline">
        View module plan
      </Link>
    </div>
  );
}
