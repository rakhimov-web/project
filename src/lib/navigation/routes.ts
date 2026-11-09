export const primaryRoutes = [
  { href: "/", title: "Asosiy" },
  { href: "/courses", title: "Kurslar" },
  { href: "/learning", title: "Ta’lim" },
  { href: "/profile", title: "Profil" },
] as const;
export function routeInfo(path: string) {
  if (path === "/") return { title: "Asosiy", parent: null, tab: "/" };
  if (path === "/profile/settings")
    return { title: "Sozlamalar", parent: "/profile", tab: "/profile" };
  if (path === "/checkout")
    return { title: "Xarid", parent: "/courses", tab: "/courses" };
  if (path === "/onboarding")
    return { title: "Xush kelibsiz", parent: "/", tab: "/" };
  if (path === "/legal/privacy")
    return { title: "Maxfiylik", parent: "/profile", tab: "/profile" };
  if (path === "/legal/terms")
    return {
      title: "Foydalanish shartlari",
      parent: "/profile",
      tab: "/profile",
    };
  if (path.startsWith("/lessons/"))
    return { title: "Dars", parent: "/learning", tab: "/learning" };
  if (path.startsWith("/courses/"))
    return { title: "Kurs haqida", parent: "/courses", tab: "/courses" };
  const primary = primaryRoutes.find((route) => route.href === path);
  return primary
    ? { title: primary.title, parent: null, tab: primary.href }
    : { title: "Sahifa", parent: "/", tab: "/" };
}
