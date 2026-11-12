import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Underline tabs for page-level sections. Scrolls horizontally on mobile. */
export const PageTabs = TabsPrimitive.Root;

export function PageTabsList({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b px-4 md:mx-0 md:px-0", className)}
      {...props}
    />
  );
}

export function PageTabsTrigger({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative -mb-px inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent px-3 pb-3 pt-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PageTabsContent({ className, ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("animate-rise pt-6 focus-visible:outline-none", className)} {...props} />;
}
