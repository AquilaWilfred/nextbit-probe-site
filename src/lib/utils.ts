import type { ProbeReport, ReportSummary, RatingTuple } from "@/types";

// ─── Score calculator ─────────────────────────────────────────────────────────

const WEIGHTS = {
  battery: 3,
  cpu: 2,
  disk: 3,
  ram: 2,
  temp: 2,
  security: 2,
  events: 1,
  startup: 1,
};

function ratingToScore(rating: RatingTuple): number {
  const map: Record<string, number> = {
    EXCELLENT: 100,
    GOOD: 80,
    FAIR: 60,
    POOR: 40,
    "VERY POOR": 20,
  };
  return map[rating[0]] ?? 50;
}

export function computeReportSummary(report: ProbeReport): ReportSummary {
  const scores = {
    battery: ratingToScore(report.battery.rating),
    cpu: ratingToScore(report.cpu_throttle.rating),
    disk: ratingToScore(report.disks.smart.power_rating),
    ram: ratingToScore(report.ram_test.rating),
    temp: ratingToScore(report.temperature.rating),
    security: ratingToScore(report.events.rating),
    events: ratingToScore(report.events.rating),
    startup: ratingToScore(report.performance.startup_rating),
  };

  const totalWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  const weightedSum = (Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).reduce(
    (acc, key) => acc + scores[key] * WEIGHTS[key],
    0
  );

  const score = Math.round(weightedSum / totalWeight / 10); // out of 10 → scale to /28
  const scaled = Math.round((score / 10) * 28);

  const vals = Object.values(scores);
  const passedCount = vals.filter((v) => v >= 60).length;
  const failedCount = vals.length - passedCount;

  const hardware =
    Math.round((scores.battery + scores.cpu + scores.disk + scores.ram + scores.temp) / 5);
  const software = Math.round((scores.startup + scores.events) / 2);
  const security = scores.security;

  let overallRating = "POOR";
  let ratingColor = "#ffa726";
  if (scaled >= 22) { overallRating = "EXCELLENT"; ratingColor = "#00e676"; }
  else if (scaled >= 18) { overallRating = "GOOD"; ratingColor = "#29b6f6"; }
  else if (scaled >= 14) { overallRating = "FAIR"; ratingColor = "#ffa726"; }

  return {
    score: scaled,
    totalPossible: 28,
    passedCount,
    failedCount,
    categoryScores: { hardware, software, security },
    overallRating,
    ratingColor,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatGb(gb: number): string {
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${Math.round(gb * 1024)} MB`;
}

export function formatMhz(mhz: number): string {
  return mhz >= 1000 ? `${(mhz / 1000).toFixed(2)} GHz` : `${mhz} MHz`;
}

export function formatUptime(lastBoot: string): string {
  const match = lastBoot.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
  if (!match) return "Unknown";
  const boot = new Date(match[1]);
  const now = new Date();
  const diffH = Math.round((now.getTime() - boot.getTime()) / 3600000);
  if (diffH < 24) return `${diffH}h uptime`;
  return `${Math.floor(diffH / 24)}d uptime`;
}

export function ratingBadgeClass(rating: string): string {
  const map: Record<string, string> = {
    EXCELLENT: "badge-excellent",
    GOOD: "badge-good",
    FAIR: "badge-fair",
    POOR: "badge-poor",
    "VERY POOR": "badge-verypoor",
  };
  return map[rating] ?? "badge-fair";
}
