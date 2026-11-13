import { FilterChips } from "@/components/ds/filter-bar";
import type { Player } from "@/data/types";

export function ChildSelector({
  children,
  value,
  onChange,
}: {
  children: Player[];
  value: string;
  onChange: (childId: string) => void;
}) {
  if (!children.length) return null;

  return (
    <div className="space-y-2">
      <div className="text-label text-muted-foreground">Viewing child</div>
      <FilterChips
        value={value}
        onChange={onChange}
        options={children.map((child) => ({
          value: child.id,
          label: child.nickname ?? child.name,
        }))}
      />
    </div>
  );
}