import { describe, expect, it } from "vitest";
import {
  filterCourses,
  getHomeData,
  homePreviewState,
  mockHomeSource,
  setCourseSaved,
} from "../../src/data/home";
describe("static Home repository", () => {
  it("filters published/category/free courses without mutating the source", async () => {
    const { courses } = await getHomeData();
    const draft = { ...courses[0], id: "draft-only", status: "draft" as const };
    const input = [...courses].reverse().concat(draft);
    const original = input.map((course) => course.id);
    expect(filterCourses(input, "all")).toHaveLength(5);
    expect(
      filterCourses(input, "ai").every((course) => course.category === "ai"),
    ).toBe(true);
    expect(filterCourses(input, "coding")).toHaveLength(2);
    expect(filterCourses(input, "free").map((course) => course.slug)).toEqual([
      "prompt-writing",
    ]);
    expect(input.map((course) => course.id)).toEqual(original);
  });
  it("keeps demo progress references valid, separate from entitlement/auth", async () => {
    const data = await getHomeData();
    expect(
      data.courses.some((course) => course.id === data.featured_course_id),
    ).toBe(true);
    for (const progress of data.demo_progress) {
      expect(progress.source).toBe("demo");
      const course = data.courses.find(
        (item) => item.id === progress.course_id,
      )!;
      const lesson = data.lessons.find(
        (item) => item.id === progress.lesson_id,
      )!;
      expect(
        data.modules.find((item) => item.id === lesson.module_id)?.course_id,
      ).toBe(course.id);
      expect(progress.completed_lessons).toBeLessThan(course.lesson_count);
      expect(progress.position_s).toBeLessThan(lesson.duration_s);
    }
  });
  it("updates demo saved state through the source and rejects unknown/aborted writes", async () => {
    await setCourseSaved("course-ai-basics", true);
    expect((await getHomeData()).saved_course_ids).toContain(
      "course-ai-basics",
    );
    await setCourseSaved("course-ai-basics", false);
    expect((await getHomeData()).saved_course_ids).not.toContain(
      "course-ai-basics",
    );
    await expect(setCourseSaved("not-a-course", true)).rejects.toThrow(
      "Course unavailable",
    );
    const controller = new AbortController();
    controller.abort();
    await expect(
      mockHomeSource.setSaved("course-ai-basics", true, controller.signal),
    ).rejects.toHaveProperty("name", "AbortError");
    await expect(getHomeData(controller.signal)).rejects.toHaveProperty(
      "name",
      "AbortError",
    );
  });
  it("limits UI state previews to explicit static states", () => {
    expect(homePreviewState("loading")).toBe("loading");
    expect(homePreviewState("error")).toBe("error");
    expect(homePreviewState("empty")).toBe("empty");
    expect(homePreviewState("arbitrary")).toBe("ready");
  });
});
