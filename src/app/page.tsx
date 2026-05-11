import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ReportCard from "@/components/sections/ReportCard";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ScanReportShowcase from "@/components/sections/ScanReportShowcase";

export const metadata: Metadata = {
  title: "NextBit Probe — Hardware diagnostics for IT professionals",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ReportCard />
      <FeatureGrid />
      <ScanReportShowcase />
    </>
  );
}
