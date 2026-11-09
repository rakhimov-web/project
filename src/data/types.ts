export type Category = "ai" | "coding";
export type CourseFilter = "all" | Category | "free";
export type CoverKind =
  "ai-orbit" | "code-window" | "python-path" | "prompt-cards" | "workflow";
export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: Category;
  level: "beginner" | "intermediate";
  cover: { kind: CoverKind; label: string };
  price_stars: number;
  status: "draft" | "published";
  sort_order: number;
  instructor: string;
  lesson_count: number;
  duration_s: number;
}
export interface Module {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
}
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  duration_s: number;
  sort_order: number;
  is_free_preview: boolean;
  video_source: { provider: "placeholder"; reference: string };
  resources: readonly string[];
}
export interface DemoProgress {
  course_id: string;
  lesson_id: string;
  completed_lessons: number;
  position_s: number;
  source: "demo";
}
export interface HomeData {
  saved_course_ids: readonly string[];
  courses: readonly Course[];
  featured_course_id: string;
  modules: readonly Module[];
  lessons: readonly Lesson[];
  demo_progress: readonly DemoProgress[];
}
export interface HomeDataSource {
  getHome: (signal?: AbortSignal) => Promise<HomeData>;
  setSaved: (
    courseId: string,
    saved: boolean,
    signal?: AbortSignal,
  ) => Promise<readonly string[]>;
}
export type HomePreviewState = "ready" | "loading" | "empty" | "error";
