"use client";
import {
  BookOpen,
  Code2,
  Compass,
  Layers3,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { ActionButton } from "@/components/ui/controls";
import {
  Avatar,
  Badge,
  GroupedList,
  Row,
  Surface,
  Text,
} from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/feedback";
import { useTelegram } from "@/lib/telegram/provider";
import { useAppNavigation } from "@/lib/navigation/provider";
const content = {
  home: {
    title: "O‘rganish shu yerdan boshlanadi.",
    text: "AI va dasturlash bo‘yicha yangi imkoniyatlarni kashf eting.",
    icon: Sparkles,
    label: "Kurslarni ko‘rish",
    href: "/courses",
  },
  courses: {
    title: "Yangi bilimlar yo‘lda",
    text: "Amaliy kurslar to‘plami tez orada shu yerda.",
    icon: BookOpen,
    label: "Kurs namunasi",
    href: "/courses/ai-basics",
  },
  learning: {
    title: "O‘z sur’atingizda o‘rganing",
    text: "Boshlagan kurslaringiz va o‘quv yo‘lingiz shu yerda bo‘ladi.",
    icon: Play,
    label: "Dars namunasi",
    href: "/lessons/first-lesson",
  },
  course: {
    title: "G‘oyadan ilk loyihagacha",
    text: "Kurs dasturi, o‘qituvchi va darslar tez orada.",
    icon: Code2,
    label: "Dars namunasi",
    href: "/lessons/first-lesson",
  },
  lesson: {
    title: "Birinchi dars sari",
    text: "Video darslar uchun tinch va qulay joy.",
    icon: Play,
    label: "Ta’limga qaytish",
    href: "/learning",
  },
  checkout: {
    title: "Xarid oynasi tayyorlanmoqda",
    text: "Hozircha to‘lov amalga oshirilmaydi.",
    icon: Wallet,
    label: "Kurslarga qaytish",
    href: "/courses",
  },
  onboarding: {
    title: "Yangi imkoniyatlarga xush kelibsiz",
    text: "AI va kod bilan g‘oyalaringizni hayotga olib chiqing.",
    icon: Compass,
    label: "Boshlash",
    href: "/",
  },
  privacy: {
    title: "Maxfiylik siyosati tayyorlanmoqda",
    text: "To‘liq siyosat ishga tushirishdan oldin shu yerda chop etiladi.",
    icon: ShieldCheck,
    label: "Profilga qaytish",
    href: "/profile",
  },
  terms: {
    title: "Foydalanish shartlari tayyorlanmoqda",
    text: "To‘liq shartlar ishga tushirishdan oldin shu yerda chop etiladi.",
    icon: ShieldCheck,
    label: "Profilga qaytish",
    href: "/profile",
  },
} as const;
export type StubKind = keyof typeof content;
export function StubScreen({ kind }: { kind: StubKind }) {
  const { navigate } = useAppNavigation();
  const data = content[kind];
  const Icon = data.icon;
  return (
    <div className="stub-screen stack">
      <Surface className="shell-placeholder">
        <span className="shell-illustration" aria-hidden="true">
          <span />
          <span />
          <Icon />
        </span>
        <Badge tone="blue">Tez kunda</Badge>
        <Text as="h2" variant="title-1">
          {data.title}
        </Text>
        <Text tone="secondary">{data.text}</Text>
        <ActionButton variant="filled" onClick={() => navigate(data.href)}>
          {data.label}
        </ActionButton>
      </Surface>
      {kind === "home" && (
        <GroupedList label="O‘rganishni boshlash">
          <Row
            icon={<BookOpen />}
            title="Amaliy bilim"
            detail="Bitta g‘oya. Bitta yangi ko‘nikma."
          />
          <Row
            icon={<Layers3 />}
            title="Kichik qadamlar"
            detail="Sizga qulay vaqtda va sur’atda."
          />
        </GroupedList>
      )}
      {kind === "course" && (
        <Sheet
          title="Darslar ro‘yxati"
          description="Kurs dasturi tez orada qo‘shiladi."
          trigger={
            <ActionButton icon={<Layers3 aria-hidden="true" />}>
              Darslarni ko‘rish
            </ActionButton>
          }
        >
          <Text tone="secondary">Yangi darslar shu yerda ko‘rinadi.</Text>
        </Sheet>
      )}
    </div>
  );
}
export function ProfileStub() {
  const { user, mode } = useTelegram();
  const { navigate } = useAppNavigation();
  const name = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : "Xush kelibsiz";
  return (
    <div className="stack">
      <Surface className="profile-summary stack">
        <Avatar name={name} />
        <Text as="h2" variant="title-1">
          {name}
        </Text>
        {user?.username && <Text tone="secondary">@{user.username}</Text>}
        <div className="inline">
          {user?.is_premium && <Badge tone="blue">Telegram Premium</Badge>}
          <Badge>
            {mode === "dev-mock"
              ? "Namuna profil"
              : user
                ? "Profil hali tasdiqlanmagan"
                : "Telegram’da oching"}
          </Badge>
        </div>
        <Text variant="footnote" tone="secondary">
          Kurslaringiz va xaridlaringiz uchun profil tasdiqlanishi kerak.
        </Text>
      </Surface>
      <GroupedList label="Profil bo‘limlari">
        <Row
          icon={<Settings2 />}
          title="Sozlamalar"
          detail="Haptics va ilova ko‘rinishi"
          trailing={
            <ActionButton
              aria-label="Sozlamalarni ochish"
              onClick={() => navigate("/profile/settings")}
              icon={<Settings2 aria-hidden="true" />}
            />
          }
        />
      </GroupedList>
      <div className="inline">
        <ActionButton onClick={() => navigate("/legal/privacy")}>
          Maxfiylik
        </ActionButton>
        <ActionButton onClick={() => navigate("/legal/terms")}>
          Shartlar
        </ActionButton>
      </div>
    </div>
  );
}
export function SettingsStub() {
  const telegram = useTelegram();
  return (
    <SettingsRows
      enabled={telegram.hapticsEnabled}
      onChange={(value) => {
        telegram.haptic("selection");
        telegram.setHapticsEnabled(value);
      }}
    />
  );
}
import { Switch } from "@/components/ui/controls";
function SettingsRows({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="stack">
      <GroupedList label="Ilova sozlamalari">
        <Row
          icon={<Sparkles />}
          title="Haptics"
          detail="Bosishda yengil tebranish"
          trailing={
            <Switch
              aria-label="Haptics"
              checked={enabled}
              onCheckedChange={onChange}
            />
          }
        />
        <Row
          icon={<User />}
          title="Til"
          detail="O‘zbekcha"
          trailing={<Badge>UZ</Badge>}
        />
      </GroupedList>
      <Text tone="secondary" variant="footnote">
        Ko‘rinish Telegram rejimiga moslashadi. Haptics qurilma
        qo‘llab-quvvatlaganida ishlaydi.
      </Text>
    </div>
  );
}
