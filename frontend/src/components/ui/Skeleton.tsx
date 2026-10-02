import type { HTMLAttributes } from "react";

export default function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden="true" className={`skeleton ${className}`} {...props} />
  );
}
