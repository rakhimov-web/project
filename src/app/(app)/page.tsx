import { Suspense } from "react";
import { HomeScreen, HomeSkeleton } from "@/components/home/home-screen";
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeScreen />
    </Suspense>
  );
}
