"use client";
import { useState, type ReactNode, type CSSProperties } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  Check,
  CheckCheck,
  CircleAlert,
  Code2,
  Home,
  Layers3,
  Moon,
  Play,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  User,
  Volume2,
} from "lucide-react";
import {
  ActionButton,
  Glass,
  Input,
  Menu,
  SearchField,
  SegmentedControl,
  Slider,
  Switch,
  TabBar,
} from "@/components/ui/controls";
import {
  Avatar,
  Badge,
  GroupedList,
  ProgressRing,
  Row,
  Skeleton,
  Surface,
  Text,
} from "@/components/ui/primitives";
import {
  MaterialProvider,
  useMaterial,
} from "@/components/ui/material-provider";
import { Sheet, ToastHost, toast } from "@/components/ui/feedback";

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="section" aria-labelledby={"section-" + number}>
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <h2 id={"section-" + number} className="text-title-2">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
const categories = [
  { value: "all", label: "Barchasi" },
  { value: "ai", label: "AI" },
  { value: "code", label: "Kod" },
  { value: "free", label: "Bepul" },
];
const tabs = [
  { value: "home", label: "Asosiy", icon: <Home /> },
  { value: "courses", label: "Kurslar", icon: <BookOpen /> },
  { value: "learn", label: "Ta’lim", icon: <Play /> },
  { value: "profile", label: "Profil", icon: <User /> },
];
function GalleryContent() {
  const { theme, solid, solidRequired, setTheme, setSolid } = useMaterial();
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState("home");
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(65);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [retried, setRetried] = useState(false);
  return (
    <>
      <main className="gallery" id="gallery">
        <header className="gallery-header">
          <div className="wordmark">
            <span className="brand-mark">
              <Code2 size={20} aria-hidden="true" />
            </span>
            AI & CODING
          </div>
          <ActionButton
            icon={
              theme === "light" ? (
                <Moon aria-hidden="true" />
              ) : (
                <Sun aria-hidden="true" />
              )
            }
            aria-label={theme === "light" ? "Qorong‘i rejim" : "Yorug‘ rejim"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          />
        </header>
        <div className="gallery-intro">
          <p className="eyebrow">Dizayn tizimi / 01</p>
          <Text as="h1" variant="large-title">
            Oddiy. Tabiiy.
            <br />
            Bir butun.
          </Text>
          <Text tone="secondary">
            O‘rganishga joy ochamiz. Har bir rang, har bir harakat — bitta
            tizimning bir qismi.
          </Text>
        </div>
        <div className="material-hero">
          <div className="hero-top">
            <div className="stack">
              <p className="hero-meta">BILIMDAN AMALIYOTGA</p>
              <p className="hero-title">
                G‘oyadan
                <br />
                mahsulotgacha.
              </p>
              <p className="hero-meta">AI · Kod · Yangi imkoniyatlar</p>
            </div>
            <div className="orbit-art" aria-hidden="true">
              &lt;/&gt;
            </div>
          </div>
          <Glass className="hero-glass">
            <span className="row-icon">
              <Layers3 aria-hidden="true" />
            </span>
            <div className="row-content">
              <span className="text-headline">
                Yengil material. Aniq maqsad.
              </span>
              <span className="text-footnote">Glass material namunasi</span>
            </div>
          </Glass>
        </div>

        <Section number="01" title="Rang va tipografika">
          <Surface className="stack">
            <div className="inline between">
              <Text variant="headline">Tanish ranglar, yangi g‘oyalar.</Text>
              <Badge tone="blue">iOS palitrasi</Badge>
            </div>
            <div className="palette">
              {[
                ["blue", "Blue"],
                ["indigo", "Indigo"],
                ["green", "Green"],
                ["orange", "Orange"],
                ["red", "Red"],
                ["yellow", "Stars"],
              ].map(([token, label]) => (
                <div className="swatch" key={token}>
                  <span
                    className="swatch-dot"
                    style={
                      { "--swatch": "var(--" + token + ")" } as CSSProperties
                    }
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="type-sample">
                <span className="sample-label">Large title · 34 / 700</span>
                <Text variant="large-title">Keyingi katta qadam.</Text>
              </div>
              <div className="type-sample">
                <span className="sample-label">Title 1 · 28 / 700</span>
                <Text variant="title-1">Yangi imkoniyatlar</Text>
              </div>
              <div className="type-sample">
                <span className="sample-label">Title 2 · 22 / 700</span>
                <Text variant="title-2">Kichik qadamlardan boshlang</Text>
              </div>
              <div className="type-sample">
                <span className="sample-label">Body · 17 / 400</span>
                <Text>Har kuni bir dars. Har kuni bir qadam oldinga.</Text>
              </div>
              <div className="type-sample">
                <span className="sample-label">Footnote · 13 / 400</span>
                <Text variant="footnote" tone="secondary">
                  Inter lokal yuklanadi. Narx va progress:{" "}
                  <span className="tabular">240 ⭐ · 65%</span>
                </Text>
              </div>
            </div>
          </Surface>
        </Section>

        <Section number="02" title="Harakatga taklif">
          <Surface className="stack">
            <div className="inline between">
              <Text variant="headline">Tugmalar</Text>
              <Badge>Glisse</Badge>
            </div>
            <Text variant="footnote" tone="secondary">
              Asosiy, ikkilamchi, ikonka va xavfli amal.
            </Text>
            <div className="material-stage">
              <div className="inline">
                <ActionButton
                  variant="filled"
                  icon={<Play aria-hidden="true" />}
                  onClick={() => toast.success("Davom etishga tayyor")}
                >
                  Davom etish
                </ActionButton>
                <ActionButton
                  icon={<Bookmark aria-hidden="true" />}
                  aria-label="Saqlash"
                  onClick={() => toast.success("Saqlandi")}
                />
              </div>
            </div>
            <div className="inline">
              <ActionButton onClick={() => toast("Batafsil ma’lumot")}>
                Batafsil <ArrowRight aria-hidden="true" />
              </ActionButton>
              <ActionButton
                destructive
                icon={<Trash2 aria-hidden="true" />}
                onClick={() => toast.error("Bu faqat dizayn namunasi")}
              >
                O‘chirish
              </ActionButton>
            </div>
            <div className="divider" />
            <div className="inline">
              <ActionButton disabled>Hozir mavjud emas</ActionButton>
              <ActionButton variant="filled" busy>
                Yuklanmoqda
              </ActionButton>
            </div>
            <Text variant="footnote" tone="secondary">
              Klaviaturada Tab bilan fokusni, bosib turib pressed holatini
              tekshiring.
            </Text>
          </Surface>
        </Section>

        <Section number="03" title="Tanlov va boshqaruv">
          <div className="stack">
            <Surface className="stack">
              <div className="inline between">
                <Text variant="headline">Segmentlar</Text>
                <Badge>Glisse</Badge>
              </div>
              <div className="control-container">
                <SegmentedControl
                  aria-label="Kurs toifasi"
                  items={categories}
                  value={category}
                  onValueChange={setCategory}
                />
              </div>
              <Text variant="footnote" tone="secondary">
                Tanlangan:{" "}
                <span data-testid="category-value">
                  {categories.find((item) => item.value === category)?.label}
                </span>
              </Text>
              <div className="divider" />
              <Text variant="headline">Navigatsiya</Text>
              <div className="material-stage">
                <div className="control-container">
                  <TabBar
                    aria-label="Galereya navigatsiyasi"
                    items={tabs}
                    value={tab}
                    onValueChange={setTab}
                  />
                </div>
              </div>
              <div
                role="tabpanel"
                aria-label={tabs.find((item) => item.value === tab)?.label}
              >
                <Text variant="footnote" tone="secondary">
                  Faol bo‘lim: {tabs.find((item) => item.value === tab)?.label}.
                  Bu navigatsiya namunasi.
                </Text>
              </div>
            </Surface>
            <GroupedList label="Boshqaruv namunalari">
              <Row
                icon={<Bell />}
                title="Bildirishnomalar"
                detail={notifications ? "Yoqilgan" : "O‘chirilgan"}
                trailing={
                  <Switch
                    aria-label="Bildirishnomalar"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                }
              />
              <Row
                icon={<ShieldCheck />}
                title="Solid material"
                detail={
                  solidRequired
                    ? "Tizim sozlamasi talab qiladi"
                    : "Shaffofliksiz ko‘rinish"
                }
                trailing={
                  <Switch
                    aria-label="Solid material"
                    disabled={solidRequired}
                    checked={solid}
                    onCheckedChange={setSolid}
                  />
                }
              />
              <Row
                icon={<Bell />}
                title="Mavjud emas"
                detail="Disabled switch"
                trailing={
                  <Switch aria-label="Mavjud bo‘lmagan sozlama" disabled />
                }
              />
            </GroupedList>
            <Surface className="stack">
              <div className="inline between">
                <Text variant="headline">Ovoz balandligi</Text>
                <span
                  className="text-footnote tabular"
                  data-testid="volume-value"
                >
                  {volume}%
                </span>
              </div>
              <div className="inline">
                <Volume2 aria-hidden="true" />
                <Slider
                  aria-label="Ovoz balandligi"
                  min={0}
                  max={100}
                  value={volume}
                  onValueChange={setVolume}
                />
              </div>
              <Slider
                aria-label="Mavjud bo‘lmagan slider"
                disabled
                defaultValue={35}
              />
              <div className="divider" />
              <div className="inline between">
                <div className="stack-tight">
                  <Text variant="headline">Kontekst menyusi</Text>
                  <Text variant="footnote" tone="secondary">
                    Saqlash, ulashish, o‘chirish.
                  </Text>
                </div>
                <Menu
                  aria-label="Kurs amallari"
                  items={[
                    {
                      label: "Saqlash",
                      icon: <Bookmark />,
                      onSelect: () => toast.success("Kurs saqlandi"),
                    },
                    { label: "Ulashish", disabled: true },
                    "separator",
                    {
                      label: "O‘chirish",
                      icon: <Trash2 />,
                      destructive: true,
                      onSelect: () =>
                        toast.error("Namuna: o‘chirish bajarilmadi"),
                    },
                  ]}
                />
              </div>
            </Surface>
            <Surface>
              <fieldset disabled className="disabled-demo">
                <legend className="text-footnote tone-secondary">
                  Disabled guruh
                </legend>
                <div className="stack">
                  <div className="control-container">
                    <SegmentedControl
                      aria-label="Mavjud bo‘lmagan segmentlar"
                      items={categories}
                      value="all"
                    />
                  </div>
                  <div className="control-container">
                    <TabBar
                      aria-label="Mavjud bo‘lmagan navigatsiya"
                      items={tabs}
                      value="home"
                    />
                  </div>
                  <div className="inline">
                    <Menu
                      aria-label="Mavjud bo‘lmagan menyu"
                      items={[{ label: "Mavjud emas", disabled: true }]}
                    />
                    <Input
                      aria-label="Mavjud bo‘lmagan input"
                      placeholder="Mavjud emas"
                      disabled
                    />
                    <SearchField
                      aria-label="Mavjud bo‘lmagan qidiruv"
                      placeholder="Qidiruv mavjud emas"
                      disabled
                    />
                  </div>
                </div>
              </fieldset>
            </Surface>
          </div>
        </Section>

        <Section number="04" title="Maydonlar va qatorlar">
          <div className="stack">
            <Surface className="stack">
              <label className="field-label">
                Kurs qidirish
                <SearchField
                  aria-label="Kurs qidirish"
                  placeholder="AI yoki dasturlash…"
                  value={search}
                  onValueChange={setSearch}
                />
              </label>
              <label className="field-label">
                Ismingiz
                <Input
                  aria-label="Ismingiz"
                  placeholder="Masalan, Aziz"
                  icon={<User aria-hidden="true" />}
                  value={name}
                  onValueChange={setName}
                />
              </label>
              <label className="field-label">
                Xato holati
                <Input
                  aria-label="Xato holati"
                  aria-invalid="true"
                  aria-describedby="field-error"
                  defaultValue="Namuna"
                />
              </label>
              <p id="field-error" className="field-error">
                Bu qiymatni tekshirib, qayta kiriting.
              </p>
            </Surface>
            <GroupedList label="Profil namunasi">
              <Row
                title="Aziz Karimov"
                detail="@aziz · Namuna profil"
                icon={<Avatar name="Aziz Karimov" />}
                trailing={<Badge tone="blue">O‘quvchi</Badge>}
              />
              <Row
                icon={<BookOpen />}
                title="O‘quv yo‘li"
                detail="12 darsdan 8 tasi tugallangan"
                trailing={<ProgressRing value={65} label="Kurs progressi" />}
              />
              <Row
                icon={<Sparkles />}
                title="Yangi ko‘nikma"
                detail="Har kuni bir qadam"
                trailing={<Badge tone="success">Tayyor</Badge>}
              />
            </GroupedList>
          </div>
        </Section>

        <Section number="05" title="Har bir holat hisobda">
          <div className="state-grid">
            <Surface className="state-card">
              <Badge>Loading</Badge>
              <Skeleton label="Kurslar yuklanmoqda" />
              <Text variant="footnote" tone="secondary">
                Kontent kelguncha joyi saqlanadi.
              </Text>
            </Surface>
            <Surface className="state-card">
              <span className="state-icon">
                <BookOpen aria-hidden="true" />
              </span>
              <Text variant="headline">Hali kurs yo‘q</Text>
              <Text variant="footnote" tone="secondary">
                Birinchi kursingiz shu yerda ko‘rinadi.
              </Text>
              <ActionButton
                onClick={() => toast("Katalog keyingi bosqichda yaratiladi")}
              >
                Kurslarni ko‘rish
              </ActionButton>
            </Surface>
            <Surface className="state-card error-state">
              <span className="state-icon">
                {retried ? (
                  <Check aria-hidden="true" />
                ) : (
                  <CircleAlert aria-hidden="true" />
                )}
              </span>
              <Text variant="headline">
                {retried ? "Qayta yuklandi" : "Yuklab bo‘lmadi"}
              </Text>
              <Text variant="footnote" tone="secondary">
                {retried
                  ? "Bu statik holat namunasi."
                  : "Qayta urinib ko‘ring."}
              </Text>
              <ActionButton
                onClick={() => {
                  setRetried(!retried);
                  toast.success("Namuna yangilandi");
                }}
              >
                {retried ? "Xatoni ko‘rsatish" : "Qayta urinish"}
              </ActionButton>
            </Surface>
          </div>
        </Section>

        <Section number="06" title="Yengil javob">
          <Surface className="stack">
            <Text variant="headline">Kerakli paytda, kerakli darajada.</Text>
            <Text variant="footnote" tone="secondary">
              Bottom sheet va qisqa bildirishnomalar bir xil vizual tilda.
            </Text>
            <div className="inline">
              <Sheet
                trigger={
                  <ActionButton icon={<Layers3 aria-hidden="true" />}>
                    Sheet ochish
                  </ActionButton>
                }
                title="Kichik qadam, katta natija"
                description="Bu qayta ishlatiladigan bottom sheet namunasi."
              >
                <div className="stack">
                  <GroupedList label="Sheet tafsilotlari">
                    <Row
                      title="Material"
                      detail="Bir xil radius va tipografika"
                      icon={<Layers3 />}
                    />
                    <Row
                      title="Accessibility"
                      detail="Fokus ichkarida, Escape bilan yopiladi"
                      icon={<ShieldCheck />}
                    />
                  </GroupedList>
                  <ActionButton
                    variant="filled"
                    onClick={() => toast.success("Ajoyib! Davom etamiz.")}
                  >
                    Tushunarli <CheckCheck aria-hidden="true" />
                  </ActionButton>
                </div>
              </Sheet>
              <ActionButton
                onClick={() =>
                  toast.success("O‘zgarishlar saqlandi", {
                    description: "Bu faqat dizayn namunasi.",
                  })
                }
              >
                Success toast
              </ActionButton>
              <ActionButton onClick={() => toast.error("Qayta urinib ko‘ring")}>
                Error toast
              </ActionButton>
            </div>
          </Surface>
        </Section>
        <footer className="gallery-footer">
          <span>
            AI & Coding
            <br />
            Design foundation · v0.1
          </span>
          <span>
            4/8 pt rhythm
            <br />
            Light + Dark
          </span>
        </footer>
      </main>
      <ToastHost />
    </>
  );
}
export function Gallery() {
  return (
    <MaterialProvider>
      <GalleryContent />
    </MaterialProvider>
  );
}
