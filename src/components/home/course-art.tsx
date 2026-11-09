import type { CoverKind } from "@/data/types";
import { Code2, GitBranch, Layers3, Sparkles, Workflow } from "lucide-react";
const symbols = {
  "ai-orbit": Sparkles,
  "code-window": Code2,
  "python-path": GitBranch,
  "prompt-cards": Layers3,
  workflow: Workflow,
};
export function CourseArt({
  kind,
  label,
  decorative = false,
}: {
  kind: CoverKind;
  label: string;
  decorative?: boolean;
}) {
  const Icon = symbols[kind];
  return (
    <div
      className={"course-art art-" + kind}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <svg
        className="art-orbits"
        viewBox="0 0 200 160"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="100"
          cy="80"
          rx="78"
          ry="42"
          transform="rotate(-28 100 80)"
        />
        <ellipse
          cx="100"
          cy="80"
          rx="78"
          ry="42"
          transform="rotate(28 100 80)"
        />
        <circle cx="100" cy="80" r="54" />
        <circle cx="158" cy="48" r="5" className="orbit-dot" />
      </svg>
      <span className="art-core">
        <Icon aria-hidden="true" />
      </span>
      <span className="art-caption" aria-hidden="true">
        {kind === "code-window"
          ? "build(idea)"
          : kind === "python-path"
            ? "start → create"
            : kind === "workflow"
              ? "think · automate"
              : kind === "prompt-cards"
                ? "ask → refine"
                : "idea → reality"}
      </span>
    </div>
  );
}
