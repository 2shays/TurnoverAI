import Header from "@/components/layout/header";
import OverviewSection from "@/components/sections/overview";
import DataSourcesSection from "@/components/sections/data-sources";
import ModelingApproachSection from "@/components/sections/modeling-approach";
import InteractiveDemo from "@/components/sections/interactive-demo";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <OverviewSection />
        <DataSourcesSection />
        <ModelingApproachSection />
        <InteractiveDemo />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TurnoverAI. All rights reserved.
      </footer>
    </div>
  );
}
