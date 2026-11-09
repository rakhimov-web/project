import { homeFixture } from "./mock/home";
import type {
  Course,
  CourseFilter,
  HomeData,
  HomeDataSource,
  HomePreviewState,
} from "./types";
export function filterCourses(
  courses: readonly Course[],
  filter: CourseFilter,
) {
  return courses
    .filter(
      (course) =>
        course.status === "published" &&
        (filter === "all" ||
          (filter === "free" && course.price_stars === 0) ||
          course.category === filter),
    )
    .sort((a, b) => a.sort_order - b.sort_order);
}
const savedCourses = new Set<string>();
export const mockHomeSource: HomeDataSource = {
  async getHome(signal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return { ...homeFixture, saved_course_ids: [...savedCourses] };
  },
  async setSaved(courseId, saved, signal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (
      !homeFixture.courses.some(
        (course) => course.id === courseId && course.status === "published",
      )
    )
      throw new Error("Course unavailable");
    if (saved) savedCourses.add(courseId);
    else savedCourses.delete(courseId);
    return [...savedCourses];
  },
};
/** Replacement boundary for Step 8. Components never import fixtures directly. */
export function getHomeData(signal?: AbortSignal) {
  return mockHomeSource.getHome(signal);
}
export function setCourseSaved(
  courseId: string,
  saved: boolean,
  signal?: AbortSignal,
) {
  return mockHomeSource.setSaved(courseId, saved, signal);
}
export function emptyHomeData(): HomeData {
  return {
    saved_course_ids: [],
    courses: [],
    featured_course_id: "",
    modules: [],
    lessons: [],
    demo_progress: [],
  };
}
export function homePreviewState(value: string | null): HomePreviewState {
  return value === "loading" || value === "empty" || value === "error"
    ? value
    : "ready";
}
export function durationLabel(seconds: number) {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return hours
    ? hours + " soat" + (minutes % 60 ? " " + (minutes % 60) + " daq" : "")
    : minutes + " daq";
}
