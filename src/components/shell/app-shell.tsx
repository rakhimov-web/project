"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Link from "next/link";
import { brand } from "@/config/brand";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Home,
  Play,
  Settings2,
  User,
} from "lucide-react";
import { MaterialProvider } from "@/components/ui/material-provider";
import { ActionButton, TabBar } from "@/components/ui/controls";
import { Avatar, Skeleton, initialsFor } from "@/components/ui/primitives";
import { ToastHost } from "@/components/ui/feedback";
import { TelegramProvider, useTelegram } from "@/lib/telegram/provider";
import { bindBackButton, syncHostColors } from "@/lib/telegram/bridge";
import {
  NavigationProvider,
  useAppNavigation,
} from "@/lib/navigation/provider";
import { primaryRoutes, routeInfo } from "@/lib/navigation/routes";
import { RouteFrame } from "./route-frame";
import { OfflineView, SdkFailure } from "./status-views";

const icons = [
  <Home key="home" />,
  <BookOpen key="courses" />,
  <Play key="learning" />,
  <User key="profile" />,
];
const items = primaryRoutes.map((route, index) => ({
  value: route.href,
  href: route.href,
  label: route.title,
  icon: icons[index],
}));
function subscribeOnline(notify: () => void) {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
}
function ShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const route = routeInfo(pathname);
  const telegram = useTelegram();
  const profileName = telegram.user
    ? [telegram.user.first_name, telegram.user.last_name]
        .filter(Boolean)
        .join(" ")
    : "";
  const profileInitials = initialsFor(profileName);
  const { back, navigate, markLink } = useAppNavigation();
  const root = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const largeTitle = useRef<HTMLHeadingElement>(null);
  const [collapsedPath, setCollapsedPath] = useState<string | null>(null);
  const collapsed = collapsedPath === pathname;
  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
  const handleBack = useCallback(() => {
    telegram.haptic("selection");
    if (telegram.overlayBack) telegram.overlayBack();
    else back();
  }, [telegram, back]);
  useEffect(() => {
    if (telegram.app && root.current)
      syncHostColors(telegram.app, getComputedStyle(root.current));
  }, [telegram.app, telegram.theme]);
  useEffect(() => {
    if (!telegram.app) return;
    return bindBackButton(
      telegram.app,
      !!route.parent || !!telegram.overlayBack,
      handleBack,
    );
  }, [telegram.app, telegram.overlayBack, route.parent, handleBack]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scroll.current?.scrollTo({ top: 0 });
      largeTitle.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  // Root element remains mounted; route children animate independently below it.
  return (
    <div
      ref={root}
      className="app-shell"
      data-shell-theme={telegram.theme}
      data-collapsed={collapsed ? "true" : "false"}
    >
      <a className="skip-link" href="#app-content">
        Kontentga o‘tish
      </a>
      <main
        ref={scroll}
        className="shell-scroll"
        data-testid="shell-scroll"
        onScroll={() => {
          if (largeTitle.current && toolbar.current)
            setCollapsedPath(
              largeTitle.current.getBoundingClientRect().bottom <=
                toolbar.current.getBoundingClientRect().bottom
                ? pathname
                : null,
            );
        }}
      >
        <div ref={toolbar} className="shell-toolbar">
          <div className="shell-toolbar-row">
            {route.parent ? (
              <ActionButton
                icon={<ArrowLeft aria-hidden="true" />}
                aria-label="Orqaga"
                onClick={handleBack}
                haptic="none"
              />
            ) : (
              <span className="shell-wordmark">
                <span className="brand-mark">
                  <Code2 aria-hidden="true" />
                </span>
                <span>{brand.displayName}</span>
              </span>
            )}
            <span className="compact-title" aria-hidden="true">
              {route.title}
            </span>
            <ActionButton
              className="shell-avatar"
              icon={
                telegram.user ? (
                  <Avatar
                    name={[telegram.user.first_name, telegram.user.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  />
                ) : (
                  <User aria-hidden="true" />
                )
              }
              aria-label={
                telegram.user
                  ? profileInitials + " — Profilni ochish: " + profileName
                  : "Profilni ochish"
              }
              onClick={() => navigate("/profile")}
            />
          </div>
          {telegram.mode === "dev-mock" && (
            <div className="launch-label" role="status">
              DEV · Namuna Telegram profili
            </div>
          )}
          {telegram.mode === "browser" && (
            <div className="launch-label">
              Brauzer ko‘rinishi · Profil uchun Telegram’da oching
            </div>
          )}
        </div>
        <div className="shell-title">
          <p className="eyebrow">AI va dasturlash</p>
          <h1 ref={largeTitle} tabIndex={-1} className="text-large-title">
            {route.title}
          </h1>
        </div>
        <div id="app-content" className="shell-content" tabIndex={-1}>
          {telegram.mode === "loading" && (
            <div className="shell-loading">
              <Skeleton label="Ilova tayyorlanmoqda" />
            </div>
          )}
          {telegram.mode === "error" && <SdkFailure retry={telegram.retry} />}
          {telegram.mode !== "loading" &&
            telegram.mode !== "error" &&
            !online && <OfflineView />}
          <div
            hidden={
              telegram.mode === "loading" ||
              telegram.mode === "error" ||
              !online
            }
            inert={
              telegram.mode === "loading" ||
              telegram.mode === "error" ||
              !online
            }
          >
            <RouteFrame key={pathname}>{children}</RouteFrame>
          </div>
        </div>
        <footer className="shell-note">
          <Code2 aria-hidden="true" />
          <span>O‘rganing. Yarating. Ulashing.</span>
          <Settings2 aria-hidden="true" />
        </footer>
      </main>
      <div className="shell-dock-zone">
        <div className="shell-dock">
          <div className="control-container">
            <TabBar
              aria-label="Asosiy navigatsiya"
              items={items}
              value={route.tab}
              link={Link}
              onValueChange={(next) => {
                if (next !== pathname) {
                  markLink();
                  telegram.haptic("selection");
                }
              }}
            />
          </div>
        </div>
      </div>
      <ToastHost />
    </div>
  );
}
function ThemedShell({ children }: { children: ReactNode }) {
  const { theme } = useTelegram();
  return (
    <MaterialProvider forcedTheme={theme}>
      <NavigationProvider>
        <ShellContent>{children}</ShellContent>
      </NavigationProvider>
    </MaterialProvider>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TelegramProvider>
      <ThemedShell>{children}</ThemedShell>
    </TelegramProvider>
  );
}
