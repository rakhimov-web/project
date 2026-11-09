import { notFound } from "next/navigation";
import { CrashHarness } from "./crash-harness";
export default function ShellQa() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CrashHarness />;
}
