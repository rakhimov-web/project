import type { HTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function Text({
  as: Tag = "p",
  tone = "primary",
  variant = "body",
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "h1" | "h2" | "h3";
  tone?: "primary" | "secondary";
  variant?:
    | "large-title"
    | "title-1"
    | "title-2"
    | "headline"
    | "body"
    | "footnote"
    | "caption";
}) {
  return (
    <Tag
      className={["text", "text-" + variant, "tone-" + tone, className].join(
        " ",
      )}
      {...props}
    />
  );
}
export function Surface({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"surface " + className} {...props}>
      {children}
    </div>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "success" | "warning";
}) {
  return <span className={"badge badge-" + tone}>{children}</span>;
}
export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
  return (
    <span className="avatar" role="img" aria-label={name}>
      {initials}
    </span>
  );
}
export function GroupedList({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grouped-list" role="group" aria-label={label}>
      {children}
    </div>
  );
}
export function Row({
  icon,
  title,
  detail,
  trailing,
  chevron = false,
}: {
  icon?: ReactNode;
  title: string;
  detail?: string;
  trailing?: ReactNode;
  chevron?: boolean;
}) {
  return (
    <div className="grouped-row">
      {icon && (
        <span className="row-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="row-content">
        <span className="text-headline">{title}</span>
        {detail && (
          <span className="text-footnote tone-secondary">{detail}</span>
        )}
      </div>
      {trailing}
      {chevron && <ChevronRight className="chevron" aria-hidden="true" />}
    </div>
  );
}
export function Skeleton({ label = "Yuklanmoqda" }: { label?: string }) {
  return (
    <div className="skeleton-group" role="status">
      <span className="sr-only">{label}</span>
      <span className="skeleton skeleton-title" />
      <span className="skeleton" />
      <span className="skeleton skeleton-short" />
    </div>
  );
}
export function ProgressRing({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const progress = Math.min(100, Math.max(0, value));
  return (
    <div
      className="progress-ring"
      role="progressbar"
      aria-label={label}
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="16" className="ring-track" />
        <circle
          cx="20"
          cy="20"
          r="16"
          pathLength="100"
          strokeDasharray={progress + " 100"}
          className="ring-fill"
        />
      </svg>
      <span>{progress}%</span>
    </div>
  );
}
