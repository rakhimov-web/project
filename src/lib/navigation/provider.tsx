"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { routeInfo } from "./routes";
type Navigation = {
  direction: number;
  navigate: (href: string) => void;
  markLink: () => void;
  back: () => void;
};
const NavigationContext = createContext<Navigation | null>(null);
export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const trail = useRef<string[]>([]);
  const [direction, setDirection] = useState(1);
  useEffect(() => {
    const pop = () => {
      trail.current.pop();
      setDirection(-1);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const markLink = useCallback(() => {
    trail.current.push(pathname);
    setDirection(1);
  }, [pathname]);
  const navigate = useCallback(
    (href: string) => {
      // Only app-owned paths. Never accept a raw URL from Telegram/user data.
      if (
        !href.startsWith("/") ||
        href.startsWith("//") ||
        href.includes("\\") ||
        href === pathname
      )
        return;
      markLink();
      router.push(href);
    },
    [router, pathname, markLink],
  );
  const back = useCallback(() => {
    setDirection(-1);
    if (trail.current.length) router.back();
    else router.replace(routeInfo(pathname).parent ?? "/");
  }, [router, pathname]);
  return (
    <NavigationContext.Provider value={{ direction, navigate, markLink, back }}>
      {children}
    </NavigationContext.Provider>
  );
}
export function useAppNavigation() {
  const value = useContext(NavigationContext);
  if (!value) throw new Error("NavigationProvider is required");
  return value;
}
