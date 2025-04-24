import Image from "next/image";
import HomeFeatureSection from "@/components/HomeFeatureSection";
import HomeHeroSection from "@/components/HomeHeroSection";

export default function Home() {
  return (
    <main>
      <HomeHeroSection />
      <HomeFeatureSection />
    </main>
  );
}
