import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-zinc-900/90 ring-1 ring-white/5 p-3 ${className}`}
    >
      {children}
    </div>
  );
}
