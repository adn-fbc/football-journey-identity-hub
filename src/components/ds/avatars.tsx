import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const sizes = cva("shrink-0", {
  variants: {
    size: { xs: "size-6 text-[10px]", sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base", xl: "size-24 text-2xl" },
  },
  defaultVariants: { size: "md" },
});

export function PersonAvatar({
  name, src, size, className, ring,
}: { name: string; src?: string; className?: string; ring?: boolean } & VariantProps<typeof sizes>) {
  return (
    <Avatar className={cn(sizes({ size }), ring && "ring-2 ring-card", className)}>
      {src && <AvatarImage src={src} alt={name} className="object-cover" />}
      <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

const crestSizes = cva("grid shrink-0 place-items-center font-display font-bold tracking-tight", {
  variants: {
    size: { xs: "size-6 rounded-md text-[8px]", sm: "size-8 rounded-lg text-[10px]", md: "size-10 rounded-lg text-xs", lg: "size-14 rounded-xl text-sm", xl: "size-20 rounded-2xl text-lg" },
    tone: { solid: "crest", soft: "crest-soft" },
  },
  defaultVariants: { size: "md", tone: "solid" },
});

/** Generated crest for organizations and teams. Hue comes from organization data. */
export function Crest({
  label, hue, size, tone, className,
}: { label: string; hue: string; className?: string } & VariantProps<typeof crestSizes>) {
  return (
    <span className={cn(crestSizes({ size, tone }), className)} style={{ "--crest-hue": hue } as CSSProperties} aria-hidden>
      {label}
    </span>
  );
}
