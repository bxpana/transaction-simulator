"use client";

import { BackgroundEffects } from "@/components/BackgroundEffects";
import { HeroSection } from "@/components/HeroSection";
import { TransactionBenchmark } from "@/components/TransactionBenchmark";

export default function Home() {
  return (
     <div className="min-h-screen relative">
      <BackgroundEffects />

      <main className="relative z-10 flex flex-col items-center">
        <HeroSection />
        <TransactionBenchmark />
      </main>
    </div>
  );
}
