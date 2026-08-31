import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={cn("md:animate-in md:fade-in-0 md:duration-200", className)}>
      {children}
    </div>
  );
}


