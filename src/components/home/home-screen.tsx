"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Check,
  CircleAlert,
  Clock3,
  Code2,
  Layers3,
  LoaderCircle,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { ActionButton, SegmentedControl } from "@/components/ui/controls";
import {
  Badge,
  ProgressRing,
  Skeleton,
  Surface,
  Text,
} from "@/components/ui/primitives";
import { toast } from "@/components/ui/feedback";
import { useMaterial } from "@/components/ui/material-provider";
import { useAppNavigation } from "@/lib/navigation/provider";
import { useTelegram } from "@/lib/telegram/provider";
import {
  durationLabel,
  emptyHomeData,
  filterCourses,
  getHomeData,
  homePreviewState,
  setCourseSaved,
} from "@/data/home";
import type { Course, CourseFilter, HomeData } from "@/data/types";
import { CourseArt } from "./course-art";

const filters = [
  { value: "all", label: "Barchasi" },
  { value: "ai", label: "AI" },
  { value: "coding", label: "Kod" },
  { value: "free", label: "Bepul" },
];
function courseHref(course: Course) {
  return "/courses/" + encodeURIComponent(course.slug);
}
function Price({ value }: { value: number }) {
  return (
    <span className="course-price tabular">
      {value === 0 ? (
        "Bepul"
      ) : (
        <>
          <Star className="price-star" aria-hidden="true" />
          <span>{value}</span>
          <span className="sr-only"> Telegram Stars</span>
        </>
      )}
    </span>
  );
}
export function HomeSkeleton() {
  return (
    <div className="home-screen home-skeleton" aria-busy="true">
      <Surface>
        <Skeleton label="Tavsiya kursi yuklanmoqda" />
      </Surface>
      <Surface>
        <Skeleton label="O‘quv yo‘li yuklanmoqda" />
      </Surface>
      <div className="home-rail">
        <Surface>
          <Skeleton label="Kurslar yuklanmoqda" />
        </Surface>
        <Surface aria-hidden="true">
          <Skeleton />
        </Surface>
      </div>
    </div>
  );
}
function HomeState({ error, retry }: { error?: boolean; retry: () => void }) {
  const { navigate } = useAppNavigation();
  return (
    <Surface className="home-state stack">
      <span className="state-icon">
        {error ? <CircleAlert aria-hidden="true" /> : <BookIcon />}
      </span>
      <Text as="h2" variant="title-2">
        {error ? "Kurslarni yuklab bo‘lmadi" : "Yangi kurslar tez orada"}
      </Text>
      <Text tone="secondary">
        {error
          ? "Qayta urinib ko‘ring. O‘quv yo‘lingiz shu yerda kutadi."
          : "Yangi imkoniyatlar uchun bu yerga yana qayting."}
      </Text>
      <ActionButton onClick={error ? retry : () => navigate("/courses")}>
        {error ? "Qayta urinish" : "Barcha kurslar"}
      </ActionButton>
    </Surface>
  );
}
function BookIcon() {
  return <Layers3 aria-hidden="true" />;
}

type Load =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: HomeData };
export function HomeScreen() {
  const params = useSearchParams();
  const preview = homePreviewState(params.get("homeState"));
  const [acknowledged, setAcknowledged] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [load, setLoad] = useState<Load>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    getHomeData(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setLoad({ status: "ready", data });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoad({ status: "error" });
      });
    return () => controller.abort();
  }, [attempt]);
  const retry = () => {
    setAcknowledged(true);
    setLoad({ status: "loading" });
    setAttempt((value) => value + 1);
  };
  if ((!acknowledged && preview === "loading") || load.status === "loading")
    return <HomeSkeleton />;
  if ((!acknowledged && preview === "error") || load.status === "error")
    return <HomeState error retry={retry} />;
  const data =
    !acknowledged && preview === "empty" ? emptyHomeData() : load.data;
  return data.courses.length ? (
    <HomeContent data={data} />
  ) : (
    <HomeState retry={retry} />
  );
}
function SaveButton({
  course,
  featured = false,
  saved,
  busy,
  onSave,
}: {
  course: Course;
  featured?: boolean;
  saved: boolean;
  busy: boolean;
  onSave: () => void;
}) {
  return (
    <ActionButton
      className="course-save"
      aria-label={
        featured ? "Tavsiya kursini saqlash" : course.title + " — Saqlash"
      }
      aria-pressed={saved}
      aria-busy={busy || undefined}
      disabled={busy}
      onClick={onSave}
      icon={
        busy ? (
          <LoaderCircle className="spinner" aria-hidden="true" />
        ) : saved ? (
          <Check aria-hidden="true" />
        ) : (
          <Bookmark aria-hidden="true" />
        )
      }
    />
  );
}
function HomeContent({ data }: { data: HomeData }) {
  const { navigate } = useAppNavigation();
  const { haptic } = useTelegram();
  const [filter, setFilter] = useState<CourseFilter>("all");
  const [saved, setSaved] = useState<ReadonlySet<string>>(
    new Set(data.saved_course_ids),
  );
  const [saving, setSaving] = useState<ReadonlySet<string>>(new Set());
  const courses = filterCourses(data.courses, filter);
  const featured =
    data.courses.find(
      (course) =>
        course.id === data.featured_course_id && course.status === "published",
    ) ?? courses[0];
  async function save(course: Course) {
    if (saving.has(course.id)) return;
    const next = !saved.has(course.id);
    setSaving((current) => new Set([...current, course.id]));
    try {
      const result = await setCourseSaved(course.id, next);
      setSaved(new Set(result));
      toast.success(
        next ? "Saqlanganlarga qo‘shildi" : "Saqlanganlardan olib tashlandi",
      );
    } catch {
      haptic("error");
      toast.error("Saqlab bo‘lmadi. Qayta urinib ko‘ring.");
    } finally {
      setSaving(
        (current) => new Set([...current].filter((id) => id !== course.id)),
      );
    }
  }
  function renderSave(course: Course, isFeatured = false) {
    return (
      <SaveButton
        course={course}
        featured={isFeatured}
        saved={saved.has(course.id)}
        busy={saving.has(course.id)}
        onSave={() => void save(course)}
      />
    );
  }
  return (
    <div className="home-screen">
      {featured && (
        <section className="home-hero" aria-label="Tavsiya etilgan kurs">
          <div className="hero-art">
            <CourseArt
              kind={featured.cover.kind}
              label={featured.cover.label}
              decorative
            />
          </div>
          <div className="hero-top">
            <span className="hero-kicker">
              <Sparkles aria-hidden="true" /> TAVSIYA ETILGAN
            </span>
            {renderSave(featured, true)}
          </div>
          <div className="home-hero-copy">
            <h2>{featured.title}</h2>
            <p>{featured.subtitle}</p>
            <span className="hero-details">
              {featured.lesson_count} dars <span aria-hidden="true">·</span>{" "}
              {durationLabel(featured.duration_s)}{" "}
              <span aria-hidden="true">·</span>{" "}
              {featured.level === "beginner" ? "Boshlang‘ich" : "O‘rta"}
            </span>
          </div>
          <div className="hero-bottom">
            <ActionButton
              className="hero-primary"
              variant="filled"
              onClick={() => navigate(courseHref(featured))}
            >
              Kursni ko‘rish <ArrowRight aria-hidden="true" />
            </ActionButton>
            <Price value={featured.price_stars} />
          </div>
        </section>
      )}

      <section className="home-section" aria-labelledby="continue-title">
        <div className="home-section-heading">
          <h2 id="continue-title" className="text-title-2">
            Davom etish
          </h2>
          <Badge>Namuna progress</Badge>
        </div>
        <ul
          className="home-rail continue-rail"
          role="list"
          aria-label="Namuna o‘quv yo‘li"
        >
          {data.demo_progress.map((progress) => {
            const course = data.courses.find(
              (item) => item.id === progress.course_id,
            );
            const lesson = data.lessons.find(
              (item) => item.id === progress.lesson_id,
            );
            if (!course || !lesson) return null;
            const percentage = Math.round(
              (progress.completed_lessons / course.lesson_count) * 100,
            );
            return (
              <li className="continue-card" key={course.id}>
                <div className="continue-main">
                  <ProgressRing
                    value={percentage}
                    label={course.title + " — namuna progress"}
                  />
                  <div className="continue-copy">
                    <h3>{course.title}</h3>
                    <p>
                      {progress.completed_lessons}/{course.lesson_count} dars
                      tugallangan
                    </p>
                  </div>
                  <ActionButton
                    aria-label={course.title + " — Davom etish"}
                    icon={<Play aria-hidden="true" />}
                    onClick={() =>
                      navigate("/lessons/" + encodeURIComponent(lesson.id))
                    }
                  />
                </div>
                <div className="continue-next">
                  <span className="continue-dot" />
                  <span>{lesson.title}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="discover-title">
        <div className="home-section-heading">
          <h2 id="discover-title" className="text-title-2">
            Siz uchun kurslar
          </h2>
          <ActionButton
            className="home-text-action"
            aria-label="Barcha kurslarni ko‘rish"
            onClick={() => navigate("/courses")}
            icon={<ArrowRight aria-hidden="true" />}
          />
        </div>
        <div className="control-container home-filters">
          <SegmentedControl
            aria-label="Kurs toifasi"
            items={filters}
            value={filter}
            onValueChange={(value) => {
              if (
                value === "all" ||
                value === "ai" ||
                value === "coding" ||
                value === "free"
              ) {
                setFilter(value);
                haptic("selection");
              }
            }}
          />
        </div>
        <p className="home-results" role="status">
          {courses.length} ta kurs <span aria-hidden="true">·</span>{" "}
          {filter === "free"
            ? "Boshlash uchun qulay imkoniyat"
            : "O‘zingizga mos yo‘lni toping"}
        </p>
        {(["ai", "coding"] as const).map((category) => {
          const rail = courses.filter((course) => course.category === category);
          if (!rail.length) return null;
          return (
            <section
              className="course-collection"
              key={category}
              aria-label={
                category === "ai" ? "AI kurslari" : "Dasturlash kurslari"
              }
            >
              <h3 className="collection-title">
                {category === "ai"
                  ? "AI bilan imkoniyatlar"
                  : "Kod bilan yarating"}
              </h3>
              <ul className="home-rail course-rail" role="list">
                {rail.map((course, index) => (
                  <li
                    className="course-card"
                    key={course.id}
                    style={{ "--card-order": index } as CSSProperties}
                  >
                    <div className="course-cover">
                      <CourseArt
                        kind={course.cover.kind}
                        label={course.cover.label}
                      />
                      <div className="course-cover-actions">
                        <Badge>
                          {course.price_stars === 0
                            ? "Bepul"
                            : course.category === "ai"
                              ? "AI"
                              : "Kod"}
                        </Badge>
                        {renderSave(course)}
                      </div>
                    </div>
                    <div className="course-card-copy">
                      <p className="course-meta">
                        {course.lesson_count} dars{" "}
                        <span aria-hidden="true">·</span>{" "}
                        {durationLabel(course.duration_s)}
                      </p>
                      <h4>{course.title}</h4>
                      <p className="course-subtitle">{course.subtitle}</p>
                      <div className="course-card-footer">
                        <Price value={course.price_stars} />
                        <ActionButton
                          aria-label={course.title + " — Ko‘rish"}
                          onClick={() => navigate(courseHref(course))}
                          icon={<ArrowRight aria-hidden="true" />}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {!courses.length && (
          <Surface>
            <Text tone="secondary">Bu toifada hozircha kurs yo‘q.</Text>
          </Surface>
        )}
      </section>

      <section className="home-section" aria-labelledby="benefits-title">
        <div className="home-section-heading">
          <h2 id="benefits-title" className="text-title-2">
            Bilim amaliyotga aylansin.
          </h2>
        </div>
        <div className="home-bento">
          <div className="bento-main">
            <span className="bento-icon">
              <Layers3 aria-hidden="true" />
            </span>
            <h3>
              O‘rganganingizdan
              <br />
              loyiha yarating.
            </h3>
            <p>Har bir yo‘l amaliy mashq va kichik loyihalarga olib boradi.</p>
            <div className="bento-path" aria-hidden="true">
              <span>G‘oya</span>
              <ArrowRight />
              <span>Kod</span>
              <ArrowRight />
              <span>Natija</span>
            </div>
          </div>
          <div className="bento-small">
            <Clock3 aria-hidden="true" />
            <h3>O‘z sur’atingizda</h3>
            <p>Qulay vaqtda, qisqa darslar bilan.</p>
          </div>
          <div className="bento-small">
            <ShieldCheck aria-hidden="true" />
            <h3>Izchil yo‘l</h3>
            <p>Asoslardan amaliy loyihagacha.</p>
          </div>
        </div>
      </section>
      <ToolMarquee />
      <p className="home-demo-note">
        Namuna katalog va o‘quv progressi. To‘lovlar hozircha yoqilmagan.
      </p>
    </div>
  );
}
const tools = [
  "AI",
  "React",
  "TypeScript",
  "Python",
  "Next.js",
  "Git",
] as const;
function ToolMarquee() {
  const { reducedMotion, solid } = useMaterial();
  const [paused, setPaused] = useState(false);
  const forced = reducedMotion || solid;
  return (
    <section
      className="home-section tool-section"
      aria-labelledby="tools-title"
    >
      <div className="home-section-heading">
        <div>
          <p className="eyebrow">AMALIY KO‘NIKMALAR</p>
          <h2 id="tools-title" className="text-title-2">
            Siz ishlatadigan vositalar
          </h2>
        </div>
        <ActionButton
          disabled={forced}
          aria-label={
            forced
              ? "Vositalar harakati o‘chiq"
              : paused
                ? "Vositalar harakatini davom ettirish"
                : "Vositalar harakatini to‘xtatish"
          }
          aria-pressed={paused || forced}
          onClick={() => setPaused((value) => !value)}
          icon={
            paused || forced ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )
          }
        />
      </div>
      <div
        className="tool-marquee"
        data-paused={paused || forced ? "true" : "false"}
      >
        <div className="tool-track">
          <div className="tool-group">
            {tools.map((tool) => (
              <span className="tool-chip" key={tool}>
                <Code2 aria-hidden="true" />
                {tool}
              </span>
            ))}
          </div>
          <div className="tool-group" aria-hidden="true">
            {tools.map((tool) => (
              <span className="tool-chip" key={tool}>
                <Code2 />
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
