/**
 * ReportCard.tsx
 * NextBit Probe — public-facing scan summary card
 *
 * Data shape mirrors the HTML report output from nextbit_probe_v4.py
 * Sensitive fields (MAC addresses, IP addresses) are blurred/masked.
 * Each category group includes a plain-language findings explanation
 * for site visitors who haven't yet downloaded the tool.
 *
 * SEO: semantic HTML, aria-labels, structured metadata in data-* attrs.
 */

"use client";

import { useState, useEffect } from "react";
import type { ProbeReport } from "@/types";
import { computeReportSummary } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SmartDisk {
  device: string;
  power_on_hours: number | "N/A";
  wear_pct: number | "N/A";
  read_errors: number | "N/A";
  reallocated: number | "N/A";
}

export interface ProbeReportData {
  // Meta
  timestamp: string;
  hostname: string;
  probe_version: string;
  os_type: string;

  // Identity
  manufacturer: string;
  model: string;
  serial: string;
  machine_id: string;
  mac_addresses: string[];       // ← BLURRED in UI
  ip_addresses?: string[];       // ← BLURRED in UI
  ethernet_adapters?: number;

  // Classification
  device_category: "Laptop" | "Desktop" | "Server" | "VM" | "Unknown";
  chassis_type: string;
  form_factor: string;
  is_vm: boolean;
  hypervisor?: string;

  // CPU
  cpu: string;
  cpu_arch: string;
  cpu_cores: number | string;
  cpu_threads: number | string;
  cpu_mhz: number | string;
  cpu_throttle_pct: number | "N/A";
  cpu_throttle_rating: "EXCELLENT" | "GOOD" | "POOR" | "VERY POOR" | "N/A";
  cpu_base_mhz: number | "N/A";
  cpu_stress_mhz: number | "N/A";
  cpu_max_mhz: number | "N/A";
  cpu_thermal_warning: boolean;

  // RAM
  ram_gb: number | string;
  ram_stability: "PASS" | "ERRORS";
  ram_errors: number;
  has_ecc: boolean;
  ecc_details?: string;

  // Battery
  battery_present: boolean;
  battery_wear_pct: number | "N/A";
  battery_cycles: number | "N/A";
  battery_design_mwh: number | "N/A";
  battery_full_mwh: number | "N/A";
  battery_charge_pct: number | "N/A";
  battery_rating: "EXCELLENT" | "GOOD" | "POOR" | "VERY POOR" | "N/A";

  // Disk
  disk_power_on_hours: number | "N/A";
  disk_wear_pct: number | "N/A";
  disk_read_errors: number | "N/A";
  disk_reallocated: number | "N/A";
  disk_power_rating: "EXCELLENT" | "GOOD" | "POOR" | "VERY POOR" | "N/A";
  disk_wear_rating: "EXCELLENT" | "GOOD" | "POOR" | "VERY POOR" | "N/A";
  smart_disks?: SmartDisk[];
  disk_free_gb?: number;
  disk_total_gb?: number;
  raid_controllers?: string[];

  // GPU
  gpu_name: string;
  gpu_type: "Dedicated" | "Integrated";
  gpu_vram?: string;
  gpu_driver_date?: string;
  gpu_crashes_30d: number;
  gpu_rating: "GOOD" | "WARNING" | "CONCERNING" | "N/A";

  // BIOS
  bios_date: string;
  bios_version: string;
  bios_age_years: number | "N/A";
  bios_age_rating: "EXCELLENT" | "GOOD" | "POOR" | "VERY POOR" | "N/A";
  last_boot: string;

  // Thermal
  temperatures: Record<string, number>;
  max_temp: number | "N/A";

  // Network
  wifi_ssid?: string;
  wifi_signal?: string;
  ethernet_status?: string;
  internet_connected: boolean;
  ping_ms: number | "N/A";

  // Security
  os_activation: string;
  antivirus: string;
  firewall: string;
  tpm: string;
  secure_boot: string;

  // Performance
  cpu_load_pct: number | "N/A";
  ram_used_pct: number | "N/A";
  process_count: number | "N/A";
  startup_count: number | "N/A";
  disk_read_mbs: number | "N/A";
  disk_write_mbs: number | "N/A";

  // OS
  os_name: string;
  os_arch: string;
  os_build?: string;
  python_version?: string;

  // Events
  system_errors_48h: number;

  // Score
  score_pct: number;
  score_earned: number;
  score_total: number;
  overall_rating: "EXCELLENT" | "GOOD" | "POOR" | "VERY POOR";
  hardware_score: number;
  software_score: number;
  security_score: number;
  passed_count: number;
  failed_count: number;
  na_pct: number;

  // Gateway
  device_id?: string;
  scan_id?: string;
  is_new_device?: boolean;
  last_seen?: string;
  scan_count?: number;
}

// ─── Demo data from the provided HTML report ─────────────────────────────────

export const DEMO_REPORT: ProbeReportData = {
  timestamp: "2026-05-11 07:36:37",
  hostname: "xcoghost",
  probe_version: "4.0.0",
  os_type: "ubuntu",

  manufacturer: "Dell Inc.",
  model: "Latitude 7280",
  serial: "3K3TBH2",
  machine_id: "41c569**********e6c8c477b886f2e",
  mac_addresses: [
    "42:12:7D:12:BA:2A", 
    "56:D7:4C:F3:67:89", 
    "88:B1:11:DB:2D:47", 
    "E6:E2:AC:A0:60:DF", 
  ],
  ethernet_adapters: 1,

  device_category: "Laptop",
  chassis_type: "Notebook",
  form_factor: "Notebook",
  is_vm: false,

  cpu: "Intel Core i7-7600U @ 2.80GHz",
  cpu_arch: "x86_64",
  cpu_cores: 4,
  cpu_threads: 4,
  cpu_mhz: 2800,
  cpu_throttle_pct: 79.5,
  cpu_throttle_rating: "POOR",
  cpu_base_mhz: 2800,
  cpu_stress_mhz: 3100,
  cpu_max_mhz: 3900,
  cpu_thermal_warning: true,

  ram_gb: 16.3,
  ram_stability: "PASS",
  ram_errors: 0,
  has_ecc: false,

  battery_present: true,
  battery_wear_pct: 98.7,
  battery_cycles: 0,
  battery_design_mwh: 65276,
  battery_full_mwh: 827,
  battery_charge_pct: 100,
  battery_rating: "VERY POOR",

  disk_power_on_hours: 8679,
  disk_wear_pct: 0,
  disk_read_errors: 0,
  disk_reallocated: 0,
  disk_power_rating: "POOR",
  disk_wear_rating: "EXCELLENT",
  smart_disks: [
    { device: "/dev/sda", power_on_hours: 8679, wear_pct: 0, read_errors: 0, reallocated: 0 },
  ],
  disk_free_gb: 83.6,
  disk_total_gb: 249.8,
  raid_controllers: [
    "Intel Corporation 82801 Mobile SATA Controller [RAID mode] (rev 21)",
  ],

  gpu_name: "Intel HD Graphics (Kaby Lake)",
  gpu_type: "Integrated",
  gpu_crashes_30d: 0,
  gpu_rating: "GOOD",

  bios_date: "11/05/2024",
  bios_version: "1.40.0",
  bios_age_years: 1.5,
  bios_age_rating: "GOOD",
  last_boot: "2026-05-10 11:02",

  temperatures: {
    acpitz: 25.0,
    pch_skylake: 55.0,
    dell_smm: 31.0,
    "Package id 0": 81.0,
    "Core 0": 73.0,
    "Core 1": 81.0,
    iwlwifi_1: 30.0,
  },
  max_temp: 81.0,

  wifi_ssid: "Internet",
  wifi_signal: "-28 dBm",
  ethernet_status: "N/A",
  internet_connected: true,
  ping_ms: 34.1,

  os_activation: "N/A",
  antivirus: "None detected",
  firewall: "Active",
  tpm: "Not found",
  secure_boot: "Disabled/N/A",

  cpu_load_pct: 21.0,
  ram_used_pct: 61.7,
  process_count: 346,
  startup_count: 154,
  disk_read_mbs: 0.0,
  disk_write_mbs: 0.0,

  os_name: "Ubuntu 24.04.4 LTS",
  os_arch: "x86_64",
  os_build: "24.04",
  python_version: "3.12.3",

  system_errors_48h: 20,

  score_pct: 79,
  score_earned: 22,
  score_total: 28,
  overall_rating: "GOOD",
  hardware_score: 82,
  software_score: 71,
  security_score: 75,
  passed_count: 12,
  failed_count: 3,
  na_pct: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RATING_COLOR: Record<string, string> = {
  EXCELLENT: "#00e676",
  GOOD:      "#29b6f6",
  POOR:      "#ffa726",
  "VERY POOR": "#ef5350",
  WARNING:   "#ffa726",
  CONCERNING:"#ef5350",
  "N/A":     "#64748b",
};

const CATEGORY_ICON: Record<string, string> = {
  Laptop:  "💻",
  Desktop: "🖥",
  Server:  "🖧",
  VM:      "☁",
  Unknown: "?",
};

function ratingColor(r: string): string {
  return RATING_COLOR[r] ?? "#64748b";
}

function adaptSampleReport(sample: ProbeReport): ProbeReportData {
  const summary = computeReportSummary(sample);
  return {
    timestamp: sample.timestamp,
    hostname: sample.system.hostname,
    probe_version: "4.0.0",
    os_type: sample.system.os_type,
    manufacturer: sample.system.manufacturer,
    model: sample.system.model,
    serial: sample.system.serial,
    machine_id: sample.system.machine_id,
    mac_addresses: sample.system.mac_addrs,
    ethernet_adapters: sample.system.ethernet_adapters,
    device_category: sample.device_classification.category as ProbeReportData["device_category"],
    chassis_type: sample.device_classification.chassis_type,
    form_factor: sample.device_classification.form_factor,
    is_vm: sample.virtualization.is_vm,
    hypervisor: sample.virtualization.hypervisor,
    cpu: sample.system.cpu,
    cpu_arch: sample.system.cpu_arch,
    cpu_cores: sample.system.cpu_cores,
    cpu_threads: sample.system.cpu_threads,
    cpu_mhz: sample.system.cpu_mhz,
    cpu_throttle_pct: sample.cpu_throttle.pct,
    cpu_throttle_rating: sample.cpu_throttle.rating[0] as ProbeReportData["cpu_throttle_rating"],
    cpu_base_mhz: sample.cpu_throttle.base_mhz,
    cpu_stress_mhz: sample.cpu_throttle.stress_mhz,
    cpu_max_mhz: sample.cpu_throttle.max_mhz,
    cpu_thermal_warning: sample.cpu_throttle.warning,
    ram_gb: sample.system.ram_gb,
    ram_stability: sample.ram_test.result as ProbeReportData["ram_stability"],
    ram_errors: sample.ram_test.errors,
    has_ecc: sample.ram_test.ecc.has_ecc,
    ecc_details: sample.ram_test.ecc.details,
    battery_present: sample.battery.present,
    battery_wear_pct: sample.battery.wear_pct,
    battery_cycles: sample.battery.cycles,
    battery_design_mwh: sample.battery.design_mwh,
    battery_full_mwh: sample.battery.full_mwh,
    battery_charge_pct: sample.battery.percent,
    battery_rating: sample.battery.rating[0] as ProbeReportData["battery_rating"],
    disk_power_on_hours: sample.disks.smart.power_on_hours,
    disk_wear_pct: sample.disks.smart.wear,
    disk_read_errors: typeof sample.disks.smart.read_errors === "number" ? sample.disks.smart.read_errors : "N/A",
    disk_reallocated: sample.disks.smart.reallocated,
    disk_power_rating: sample.disks.smart.power_rating[0] as ProbeReportData["disk_power_rating"],
    disk_wear_rating: sample.disks.smart.wear_rating[0] as ProbeReportData["disk_wear_rating"],
    smart_disks: sample.disks.smart_all.map((item) => ({
      device: item.device,
      power_on_hours: item.power_on_hours,
      wear_pct: item.wear,
      read_errors: item.read_errors,
      reallocated: item.reallocated,
    })),
    disk_free_gb: sample.disks.disks?.[0]?.free_gb,
    disk_total_gb: sample.disks.disks?.[0]?.total_gb,
    raid_controllers: sample.raid_controllers ?? [],
    gpu_name: sample.gpu.gpu_name,
    gpu_type: sample.gpu.is_dedicated ? "Dedicated" : "Integrated",
    gpu_vram: sample.gpu.vram,
    gpu_driver_date: sample.gpu.driver_date,
    gpu_crashes_30d: sample.gpu.crashes,
    gpu_rating: sample.gpu.rating[0] as ProbeReportData["gpu_rating"],
    bios_date: sample.system.bios_date,
    bios_version: sample.system.bios_version,
    bios_age_years: sample.system.bios_age_years,
    bios_age_rating: sample.system.bios_age_rating[0] as ProbeReportData["bios_age_rating"],
    last_boot: sample.system.last_boot,
    temperatures: sample.temperature.temps,
    max_temp: sample.temperature.max_temp,
    wifi_ssid: sample.network.wifi_name,
    wifi_signal: sample.network.wifi_signal,
    ethernet_status: sample.network.ethernet,
    internet_connected: sample.network.internet,
    ping_ms: sample.network.ping_ms,
    os_activation: sample.security.activated,
    antivirus: sample.security.antivirus,
    firewall: sample.security.firewall,
    tpm: sample.security.tpm,
    secure_boot: sample.security.secure_boot,
    cpu_load_pct: sample.performance.cpu_pct,
    ram_used_pct: sample.performance.mem_pct,
    process_count: sample.performance.process_count,
    startup_count: sample.performance.startup_count,
    disk_read_mbs: sample.performance.disk_read_mbs,
    disk_write_mbs: sample.performance.disk_write_mbs,
    os_name: sample.system.os_name,
    os_arch: sample.system.os_arch,
    os_build: sample.system.os_build,
    python_version: sample.system.python,
    system_errors_48h: sample.events.count,
    score_pct: Math.round((summary.score / summary.totalPossible) * 100),
    score_earned: summary.score,
    score_total: summary.totalPossible,
    overall_rating: summary.overallRating as ProbeReportData["overall_rating"],
    hardware_score: summary.categoryScores.hardware,
    software_score: summary.categoryScores.software,
    security_score: summary.categoryScores.security,
    passed_count: summary.passedCount,
    failed_count: summary.failedCount,
    na_pct: 0,
  };
}

/** Replace every character in a MAC/IP with a bullet, keeping separators */
function blurSensitive(value: string): string {
  return value.replace(/[0-9A-Fa-f]/g, "•");
}

function BlurredField({ value, label }: { value: string; label: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      aria-label={revealed ? value : `${label} — hidden for privacy`}
      title={revealed ? value : "Click to reveal (demo only)"}
      onClick={() => setRevealed((v) => !v)}
      style={{
        fontFamily: "monospace",
        fontSize: 11,
        cursor: "pointer",
        filter: revealed ? "none" : "blur(4px)",
        userSelect: revealed ? "text" : "none",
        transition: "filter .2s",
        letterSpacing: revealed ? "0.04em" : "0.08em",
      }}
    >
      {revealed ? value : blurSensitive(value)}
    </span>
  );
}

function ScoreBadge({ rating }: { rating: string }) {
  const color = ratingColor(rating);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 14px",
        borderRadius: 20,
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.08em",
        background: `${color}18`,
        color,
        border: `1px solid ${color}50`,
      }}
    >
      {rating}
    </span>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      aria-label={`${pct}%`}
      style={{
        flex: 1,
        height: 7,
        borderRadius: 4,
        background: "rgba(255,255,255,.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(pct, 100)}%`,
          background: color,
          borderRadius: 4,
          transition: "width .6s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "#00d4b4",
        marginBottom: 14,
        paddingBottom: 8,
        borderBottom: "1px solid rgba(0,212,180,.12)",
      }}
    >
      {children}
    </h3>
  );
}

function KV({
  k,
  v,
  vColor,
  mono,
}: {
  k: string;
  v: React.ReactNode;
  vColor?: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "5px 0",
        borderBottom: "1px solid rgba(255,255,255,.04)",
        gap: 12,
      }}
    >
      <span style={{ color: "#64748b", fontSize: 12, flexShrink: 0 }}>{k}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          textAlign: "right",
          color: vColor,
          fontFamily: mono ? "monospace" : undefined,
          maxWidth: "65%",
          overflowWrap: "break-word",
        }}
      >
        {v}
      </span>
    </div>
  );
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#0d1524",
        border: "1px solid rgba(0,212,180,.12)",
        borderRadius: 14,
        padding: 20,
        marginBottom: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Shaded callout box explaining what the findings mean */
function FindingsBox({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      aria-label={`Findings: ${title}`}
      style={{
        marginTop: 14,
        padding: "12px 16px",
        background: "rgba(0,212,180,.04)",
        border: "1px solid rgba(0,212,180,.10)",
        borderRadius: 10,
        fontSize: 12,
        color: "#94a3b8",
        lineHeight: 1.65,
      }}
    >
      <strong style={{ color: "#00d4b4", fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.1em" }}>
        {icon} {title}
      </strong>
      <p style={{ marginTop: 6 }}>{children}</p>
    </aside>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ReportCardProps {
  data?: ProbeReportData;
}

export default function ReportCard({ data }: ReportCardProps) {
  const [reportData, setReportData] = useState<ProbeReportData | undefined>(data);

  useEffect(() => {
    if (data || reportData) return;

    fetch("/sample-report.json")
      .then((res) => res.json())
      .then((payload: ProbeReport) => setReportData(adaptSampleReport(payload)))
      .catch(() => {
        /* keep demo report if loading fails */
      });
  }, [data, reportData]);

  const d = reportData ?? data ?? DEMO_REPORT;
  const overallColor = ratingColor(d.overall_rating);
  const catIcon = CATEGORY_ICON[d.device_category] ?? "?";

  const tempWarning = typeof d.max_temp === "number" && d.max_temp > 80;

  return (
    <article
      itemScope
      itemType="https://schema.org/TechArticle"
      aria-label={`NextBit hardware diagnostic report for ${d.manufacturer} ${d.model}`}
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
        lineHeight: 1.5,
      }}
    >
      {/* ── SEO meta ─────────────────────────────────────────────────── */}
      <meta itemProp="name" content={`NextBit Probe Report — ${d.manufacturer} ${d.model}`} />
      <meta itemProp="description" content={`Hardware diagnostic scan of ${d.model} (${d.os_name}). Overall health: ${d.overall_rating} (${d.score_pct}%). Battery: ${d.battery_rating}. Disk: ${d.disk_power_rating}. CPU: ${d.cpu_throttle_rating}.`} />
      <meta itemProp="datePublished" content={d.timestamp} />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header style={{ textAlign: "center", padding: "32px 0 24px" }}>
        <h1
          itemProp="headline"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(18px,4vw,26px)",
            color: "#00d4b4",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          ⬡ NextBit Probe
        </h1>
        <p
          itemProp="description"
          style={{ color: "#64748b", marginTop: 8, fontSize: 13 }}
        >
          Hardware Diagnostic Report · 
          <time dateTime={d.timestamp}>{d.timestamp}</time>
          · {d.hostname} · {d.os_type} · v{d.probe_version}
        </p>
      </header>

      {/* ── VM warning ────────────────────────────────────────────────── */}
      {d.is_vm && (
        <div
          role="alert"
          style={{
            background: "#ffa72618",
            border: "1px solid #ffa72640",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 24 }}>⚠</span>
          <div>
            <strong style={{ color: "#ffa726" }}>Virtual Machine Detected</strong>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Hypervisor: {d.hypervisor ?? "Unknown"}. Hardware readings may reflect the host, not the VM.
              SMART and battery checks are not meaningful inside VMs.
            </p>
          </div>
        </div>
      )}

      {/* ── Hero score ───────────────────────────────────────────────── */}
      <section
        aria-label="Overall health score"
        style={{
          background: `linear-gradient(135deg,${overallColor}18,${overallColor}08)`,
          border: `1px solid ${overallColor}40`,
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {/* Badges row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <span
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              background: "#00d4b420",
              color: "#00d4b4",
              border: "1px solid #00d4b450",
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {catIcon} {d.device_category}
          </span>
          {d.has_ecc && (
            <span
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                background: "#00e67615",
                color: "#00e676",
                border: "1px solid #00e67640",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ECC RAM ✓
            </span>
          )}
          {d.raid_controllers && d.raid_controllers.length > 0 && (
            <span
              style={{
                padding: "5px 14px",
                borderRadius: 20,
                background: "#ffa72615",
                color: "#ffa726",
                border: "1px solid #ffa72640",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              🖧 RAID Detected
            </span>
          )}
        </div>

        {/* Score */}
        <div
          aria-label={`Health score: ${d.score_pct}% — ${d.overall_rating}`}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(32px,6vw,60px)",
            fontWeight: 700,
            color: overallColor,
          }}
        >
          {d.score_pct}%
        </div>
        <div
          style={{
            color: overallColor,
            fontSize: 16,
            fontWeight: 600,
            marginTop: 6,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {d.overall_rating}
        </div>

        {/* Score bar */}
        <div
          style={{
            background: "rgba(255,255,255,.06)",
            borderRadius: 8,
            height: 8,
            margin: "14px auto",
            maxWidth: 480,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${d.score_pct}%`,
              background: overallColor,
              borderRadius: 8,
            }}
          />
        </div>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
          Score {d.score_earned}/{d.score_total} · 
          {d.passed_count} passed · {d.failed_count} failed
        </p>

        {/* Category bars */}
        <div style={{ maxWidth: 380, margin: "16px auto 0", textAlign: "left" }}>
          {[
            { label: "Hardware", pct: d.hardware_score },
            { label: "Software", pct: d.software_score },
            { label: "Security", pct: d.security_score },
          ].map(({ label, pct }) => {
            const c =
              pct >= 85 ? "#00e676" : pct >= 70 ? "#29b6f6" : pct >= 50 ? "#ffa726" : "#ef5350";
            return (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    width: 70,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {label}
                </span>
                <MiniBar pct={pct} color={c} />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'Space Mono', monospace",
                    width: 36,
                    textAlign: "right",
                    color: c,
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick stat row ────────────────────────────────────────────── */}
      <div
        role="list"
        aria-label="Key hardware ratings"
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}
      >
        {[
          { label: "Battery",      value: d.battery_rating,       color: ratingColor(d.battery_rating) },
          { label: "GPU",          value: d.gpu_rating,            color: ratingColor(d.gpu_rating) },
          { label: "Disk Hours",   value: d.disk_power_rating,     color: ratingColor(d.disk_power_rating) },
          { label: "CPU Throttle", value: d.cpu_throttle_rating,   color: ratingColor(d.cpu_throttle_rating) },
        ].map(({ label, value, color }) => (
          <div
            role="listitem"
            key={label}
            style={{
              background: "#0d1524",
              border: "1px solid rgba(0,212,180,.12)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 14,
                fontWeight: 700,
                color,
                marginBottom: 4,
              }}
            >
              {value}
            </div>
            <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TWO-COLUMN LAYOUT
          ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
        <div>
          {/* System */}
          <Card>
            <SectionTitle>System</SectionTitle>
            <KV k="Manufacturer / Model" v={`${d.manufacturer} ${d.model}`} />
            <KV k="Serial Number"        v={d.serial} mono />
            <KV
              k="Machine ID"
              v={
                <BlurredField
                  value={d.machine_id}
                  label="Machine ID"
                />
              }
            />
            <KV k="Device Category"
              v={
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: "#00d4b418",
                    color: "#00d4b4",
                    border: "1px solid #00d4b440",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {catIcon} {d.device_category}
                </span>
              }
            />
            <KV k="Chassis / Form Factor" v={`${d.chassis_type} / ${d.form_factor}`} />
            <KV k="CPU"         v={d.cpu} />
            <KV k="Architecture" v={d.cpu_arch} />
            <KV k="Cores / Threads" v={`${d.cpu_cores} / ${d.cpu_threads}`} />
            <KV
              k="RAM"
              v={
                <span>
                  {d.ram_gb} GB 
                  <span style={{ fontSize: 10, color: d.has_ecc ? "#00e676" : "#64748b" }}>
                    {d.has_ecc ? "ECC ✓" : "No ECC"}
                  </span>
                </span>
              }
            />
            <KV k="OS" v={`${d.os_name} (${d.os_arch})`} />
            <KV
              k="MAC Addresses"
              v={
                <div style={{ textAlign: "right" }}>
                  {d.mac_addresses.map((mac, i) => (
                    <div key={i}>
                      <BlurredField value={mac} label="MAC address" />
                    </div>
                  ))}
                </div>
              }
            />
            {d.ethernet_adapters !== undefined && (
              <KV k="Ethernet Adapters" v={d.ethernet_adapters} />
            )}

            <FindingsBox icon="ℹ" title="What this tells you">
              This section generates a unique hardware fingerprint using the Serial Number, Machine ID, and MAC Address. 
              This signature allows for precise asset reconciliation across the NextBit Retail Engine. Sensitive identifiers are 
              currently redacted for privacy—click any blurred field to preview. All data is fully visible within your 
              localized audit reports.
            </FindingsBox>
            <p style={{ fontSize: "12px", color: "var(--hint)", fontStyle: "italic", marginTop: "12px" }}>
              * Privacy Note: NextBit Probe fingerprints are generated locally. 
              Your unique hardware ID is used to organize your scan history and is never shared with any third-party.
            </p>
          </Card>

          {/* BIOS */}
          <Card>
            <SectionTitle>BIOS</SectionTitle>
            <KV k="Date"       v={d.bios_date} />
            <KV k="Version"    v={d.bios_version} />
            <KV
              k="Age"
              v={`${d.bios_age_years} yrs — ${d.bios_age_rating}`}
              vColor={ratingColor(d.bios_age_rating)}
            />
            <KV k="Last Boot" v={d.last_boot} />
            <KV
              k="Virtualization"
              v={d.is_vm ? `VM (${d.hypervisor})` : "Bare Metal"}
              vColor={d.is_vm ? "#ffa726" : "#00e676"}
            />

            <FindingsBox icon="🔧" title="Why BIOS age matters">
              A BIOS release date within the last 2 years suggests active manufacturer support for critical 
              security patches and firmware stability. Conversely, a BIOS older than 4 years introduces 
              significant risk—potentially lacking mitigations for hardware-level vulnerabilities like  
              <strong>Spectre, Meltdown, or LogoFAIL</strong>. A machine’s firmware age of {d.bios_age_years} years 
              results in a <strong style={{ color: ratingColor(d.bios_age_rating) }}>{d.bios_age_rating} safety rating.</strong>
            </FindingsBox>
          </Card>

          <Card>
            <SectionTitle>COMMUNITY FEEDBACK</SectionTitle>
            <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--muted)", marginBottom: "16px" }}>
              NextBit Probe is a community-driven forensic tool. Your feedback directly shapes the 
              weighting logic and hardware detection algorithms of the System Engine. 
            </p>

            <FindingsBox icon="💬" title="Why your feedback is vital">
              Each machine tells a unique story, and no two hardware configurations are identical. 
              By sharing your experience—whether it’s a successful audit or a detection error—you 
              help us refine the <strong>&quot;NextBit Narrative.&quot;</strong> 
              <br /><br />
              If this tool helped you uncover a critical thermal issue or a degraded battery, or if 
              you have suggestions for new diagnostic modules, please head over to our 
              <strong> Contact & Feedback</strong> page to leave your comments.
            </FindingsBox>

            <p style={{ fontSize: "12px", color: "var(--hint)", fontStyle: "italic", marginTop: "12px" }}>
              * Note: Feedback is used solely for tool improvement and engine calibration.
            </p>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
        <div>
          {/* Battery */}
          <Card>
            <SectionTitle>Battery Health</SectionTitle>
            <div style={{ textAlign: "center", margin: "4px 0 10px" }}>
              <ScoreBadge rating={d.battery_rating} />
            </div>
            {/* Wear gauge */}
            <div
              aria-label={`Battery health gauge: ${Math.max(0, 100 - (typeof d.battery_wear_pct === "number" ? d.battery_wear_pct : 0))}%`}
              style={{
                background: "rgba(255,255,255,.06)",
                borderRadius: 8,
                height: 12,
                overflow: "hidden",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.max(0, 100 - (typeof d.battery_wear_pct === "number" ? d.battery_wear_pct : 0))}%`,
                  background: ratingColor(d.battery_rating),
                  borderRadius: 8,
                }}
              />
            </div>
            <KV k="Wear"            v={`${d.battery_wear_pct}%`} />
            <KV k="Cycles"          v={d.battery_cycles} />
            <KV k="Design / Full Cap" v={`${d.battery_design_mwh} / ${d.battery_full_mwh} mWh`} />
            <KV k="Charge"          v={`${d.battery_charge_pct}%`} />

            <FindingsBox icon="🔋" title="Understanding battery wear">
              Battery wear represents the permanent loss of energy capacity relative to original factory 
              specifications. A wear level under 10% is considered optimal, while levels exceeding 40% 
              typically result in insufficient runtime for standard workloads. This battery exhibits 
              <strong style={{ color: ratingColor(d.battery_rating) }}> {d.battery_wear_pct}% wear</strong>. 
              It retains only {typeof d.battery_full_mwh === "number" && typeof d.battery_design_mwh === "number"
                ? `${((d.battery_full_mwh / d.battery_design_mwh) * 100).toFixed(1)}%`
                : "a fraction"}{" "}
              of its original design capacity—A machine’s health at this level suggests a battery 
              replacement is necessary to maintain mobile productivity.
            </FindingsBox>
          </Card>

          {/* GPU */}
          <Card>
            <SectionTitle>GPU</SectionTitle>
            <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
              <ScoreBadge rating={d.gpu_rating} />
            </div>
            <KV k="GPU"          v={d.gpu_name} />
            <KV k="Type"         v={d.gpu_type} />
            {d.gpu_vram        && <KV k="VRAM"        v={d.gpu_vram} />}
            {d.gpu_driver_date && <KV k="Driver Date" v={d.gpu_driver_date} />}
            <KV
              k="Crashes (30d)"
              v={d.gpu_crashes_30d}
              vColor={d.gpu_crashes_30d > 3 ? "#ef5350" : d.gpu_crashes_30d > 0 ? "#ffa726" : "#00e676"}
            />

            <FindingsBox icon="🎮" title="What GPU condition means">
              The engine audits driver telemetry and system crash logs for GPU-specific interrupts. 
              Outdated drivers or recurrent display-driver timeouts (TDRs) frequently signal thermal 
              throttling or hardware degradation. An integrated GPU architecture, as seen here, 
              utilizes shared system RAM rather than dedicated VRAM—A machine’s performance with 
              this configuration is optimized for standard productivity rather than high-throughput 
              graphics workloads.
            </FindingsBox>
          </Card>

          {/* OS & Security */}
          <Card>
            <SectionTitle>OS & Security</SectionTitle>
            <KV k="Activation"  v={d.os_activation}  vColor={d.os_activation === "Activated" ? "#00e676" : "#ffa726"} />
            <KV k="Antivirus"   v={d.antivirus} />
            <KV k="Firewall"    v={d.firewall} />
            <KV k="TPM"         v={d.tpm} />
            <KV k="Secure Boot" v={d.secure_boot} />

            <FindingsBox icon="🔒" title="Security posture explained">
              A secure hardware profile requires an active firewall, verified endpoint protection, a 
              functional TPM 2.0 module, and Secure Boot enforcement. While a lack of these features 
              does not render hardware unusable, it significantly impacts the security baseline. 
              A machine’s configuration here shows an active firewall but detects no localized antivirus 
              and an absent TPM—this is standard for Unix-like environments where security 
              architectures diverge from Windows-centric requirements.
            </FindingsBox>
          </Card>

          {/* Performance */}
          <Card>
            <SectionTitle>Machine Performance</SectionTitle>
            <KV
              k="CPU Load at Scan"
              v={`${d.cpu_load_pct}%`}
              vColor={typeof d.cpu_load_pct === "number" && d.cpu_load_pct > 80 ? "#ef5350" : "#00e676"}
            />
            <KV
              k="RAM Used at Scan"
              v={`${d.ram_used_pct}%`}
              vColor={typeof d.ram_used_pct === "number" && d.ram_used_pct > 85 ? "#ef5350" : "#00e676"}
            />
            <KV k="Running Processes" v={d.process_count} />
            <KV k="Startup Items"     v={d.startup_count} />
            <KV k="Disk Read / Write" v={`${d.disk_read_mbs} / ${d.disk_write_mbs} MB/s`} />

            <FindingsBox icon="⚡" title="Performance snapshot">
              This telemetry captures CPU and memory utilization at the exact moment of execution—providing a 
              real-world idle-state baseline rather than a synthetic benchmark. Elevated metrics during 
              a scan ({d.cpu_load_pct}% CPU, {d.ram_used_pct}% RAM) typically indicate persistent background 
              processes or resource-heavy services. A machine&apos;s current idle load is within nominal parameters.{" "}
              {typeof d.startup_count === "number" && d.startup_count > 100
                ? `The detection of ${d.startup_count} startup services is high and will likely degrade boot performance.`
                : ""}
            </FindingsBox>
          </Card>
        </div>
      </div>

      {/* ── CPU Throttle + RAM ────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle>CPU Throttle Test</SectionTitle>
          <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
            <ScoreBadge rating={d.cpu_throttle_rating} />
          </div>
          <KV k="Base / Stress / Max" v={`${d.cpu_base_mhz} / ${d.cpu_stress_mhz} / ${d.cpu_max_mhz} MHz`} />
          <KV k="Maintained" v={`${d.cpu_throttle_pct}%`} vColor={ratingColor(d.cpu_throttle_rating)} />
          {d.cpu_thermal_warning && (
            <p style={{ color: "#ffa726", fontSize: 12, marginTop: 8 }}>
              ⚠ CPU thermal issues detected — check thermal paste / cooling
            </p>
          )}

          <FindingsBox icon="🌡" title="Thermal Throttle Analysis">
            The engine executes a high-intensity computational stress loop to measure the CPU&apos;s ability 
            to sustain its maximum frequency. A robust cooling architecture maintains ≥95% (EXCELLENT). 
            A machine&apos;s degradation below 85% indicates thermal throttling—a protective clock-speed 
            reduction triggered by excessive heat. This metric typically signals an obstructed cooling 
            pathway or compromised thermal interface material. This CPU maintained{" "}
            <strong style={{ color: ratingColor(d.cpu_throttle_rating) }}>
              {d.cpu_throttle_pct}%
            </strong>{" "}
            of peak clock, resulting in a {d.cpu_throttle_rating} rating.
          </FindingsBox>
        </Card>

        <Card>
          <SectionTitle>RAM Stability</SectionTitle>
          <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
            <ScoreBadge rating={d.ram_stability === "PASS" ? "EXCELLENT" : "VERY POOR"} />
          </div>
          <KV k="Result"        v={d.ram_stability} vColor={d.ram_stability === "PASS" ? "#00e676" : "#ef5350"} />
          <KV k="Blocks Tested" v="4 × 256 MB" />
          <KV k="Errors"        v={d.ram_errors} />
          <KV k="ECC"           v={d.ecc_details ?? (d.has_ecc ? "ECC Active" : "No ECC")} />

         <FindingsBox icon="🧪" title="Memory Integrity Analysis">
            The engine executes a pattern-verification sequence across available memory to identify 
            potential bit-level inconsistencies. Even a single bit-flip indicates volatile RAM, which 
            is a primary cause of non-deterministic system crashes and silent data corruption. 
            While ECC (Error-Correcting Code) architectures can mitigate single-bit failures, 
            standard consumer modules require absolute parity. This machine&apos;s memory health here 
            <strong style={{ color: "#00e676" }}> passed with zero parity errors</strong>.
          </FindingsBox>
        </Card>
      </div>

      {/* ── Disk SMART ───────────────────────────────────────────────── */}
      <Card>
        <SectionTitle>Disk SMART</SectionTitle>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 14 }}>
          {[
            { label: "Power-On Hours", value: d.disk_power_rating,  color: ratingColor(d.disk_power_rating) },
            { label: "Disk Wear",      value: d.disk_wear_rating,   color: ratingColor(d.disk_wear_rating) },
            { label: "Hours on Clock", value: d.disk_power_on_hours, color: "#64748b" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "#0d1524",
                border: "1px solid rgba(0,212,180,.12)",
                borderRadius: 12,
                padding: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color, marginBottom: 4 }}>
                {value}
              </div>
              <div style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <KV k="Reallocated Sectors" v={d.disk_reallocated} />
        <KV k="Read / Write Errors" v={`${d.disk_read_errors} / N/A`} />

        {/* Per-disk table */}
        {d.smart_disks && d.smart_disks.length > 0 && (
          <>
            <br />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Device","Power-On Hrs","Wear %","Read Errors","Reallocated"].map((h) => (
                    <th
                      key={h}
                      style={{
                        background: "rgba(0,212,180,.08)",
                        color: "#00d4b4",
                        padding: 7,
                        textAlign: "left",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
                {d.smart_disks.map((sd) => {
                  const pohColor =
                    typeof sd.power_on_hours === "number" && sd.power_on_hours > 10000
                      ? "#ef5350"
                      : typeof sd.power_on_hours === "number" && sd.power_on_hours > 5000
                      ? "#ffa726"
                      : "#00e676";
                  const wearColor =
                    typeof sd.wear_pct === "number" && sd.wear_pct > 60
                      ? "#ef5350"
                      : typeof sd.wear_pct === "number" && sd.wear_pct > 30
                      ? "#ffa726"
                      : "#00e676";
                  return (
                    <tr key={sd.device}>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,.04)", fontFamily: "monospace" }}>
                        {sd.device}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,.04)", color: pohColor }}>
                        {sd.power_on_hours}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,.04)", color: wearColor }}>
                        {sd.wear_pct}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                        {sd.read_errors}
                      </td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                        {sd.reallocated}
                      </td>
                    </tr>
                  );
                })}
              </thead>
            </table>
          </>
        )}

        {/* RAID */}
        {d.raid_controllers && d.raid_controllers.length > 0 && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "#ffa72608", border: "1px solid #ffa72630", borderRadius: 8 }}>
            <span style={{ color: "#ffa726", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
              🖧 RAID / SAS:
            </span>{" "}
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{d.raid_controllers.join(" · ")}</span>
          </div>
        )}

        <FindingsBox icon="💾" title="Storage Telemetry (S.M.A.R.T.)">
          S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) serves as a persistent 
          diagnostic log for storage hardware. <strong>Power-on hours</strong> indicate total 
          operational lifecycle; metrics exceeding 10,000 hours reflect significant hardware 
          longevity and a statistical increase in MTBF (Mean Time Between Failure). 
          <strong>Wear %</strong> quantifies the depletion of an SSD’s NAND endurance. 
          <strong>Reallocated sectors</strong> represent critical physical defects that the 
          drive controller has isolated. This machine&apos;s storage health here reflects {d.disk_power_on_hours} operational hours, {d.disk_wear_pct}% wear, 
          and {d.disk_reallocated} reallocated sectors.
        </FindingsBox>
      </Card>

      {/* ── Temperature + Network ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle>Temperature</SectionTitle>
          {Object.keys(d.temperatures).length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Sensor","Temp"].map((h) => (
                    <th
                      key={h}
                      style={{
                        background: "rgba(0,212,180,.08)", color: "#00d4b4",
                        padding: 7, textAlign: "left", fontSize: 10,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(d.temperatures).map(([label, temp]) => (
                  <tr key={label}>
                    <td style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                      {label}
                    </td>
                    <td
                      style={{
                        padding: "6px 8px",
                        borderBottom: "1px solid rgba(255,255,255,.04)",
                        color: temp > 85 ? "#ef5350" : temp > 65 ? "#ffa726" : "#00e676",
                      }}
                    >
                      {temp}°C
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#64748b", fontSize: 12 }}>No sensors accessible (run as admin/sudo)</p>
          )}

          <FindingsBox icon="🌡" title="Thermal Dynamics & Thresholds">
            Thermal metrics provide a baseline for hardware longevity and cooling efficiency. 
            Temperatures under 45°C indicate an optimal idle state, while the 45–65°C range is 
            standard for operational overhead. Sustained values exceeding 85°C represent thermal 
            stress, which accelerates component degradation and electrolyte depletion in board 
            capacitors. This machine&apos;s peak thermal sensor is currently registered at{" "}
            <strong style={{ color: tempWarning ? "#ffa726" : "#00e676" }}>
              {d.max_temp}°C
            </strong>{" "}
            {tempWarning ? "— thermal mitigation is recommended." : "— operating within nominal parameters."}
          </FindingsBox>
        </Card>

        <Card>
          <SectionTitle>Network</SectionTitle>
          {d.wifi_ssid && <KV k="Wi-Fi SSID" v={d.wifi_ssid} />}
          {d.wifi_signal && <KV k="Signal" v={d.wifi_signal} />}
          <KV
            k="Ethernet"
            v={
              d.ethernet_status && d.ethernet_status !== "N/A" ? (
                d.ethernet_status
              ) : (
                <span style={{ color: "#64748b" }}>Not connected</span>
              )
            }
          />
          <KV
            k="Internet"
            v={d.internet_connected ? "Connected" : "No connection"}
            vColor={d.internet_connected ? "#00e676" : "#ef5350"}
          />
          <KV k="Ping (8.8.8.8)" v={`${d.ping_ms} ms`} />

          {/* IP addresses blurred if provided */}
          {d.ip_addresses && d.ip_addresses.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <span style={{ color: "#64748b", fontSize: 12 }}>IP Addresses</span>
              <div style={{ marginTop: 4 }}>
                {d.ip_addresses.map((ip, i) => (
                  <div key={i}>
                    <BlurredField value={ip} label="IP address" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <FindingsBox icon="📡" title="Network Connectivity & Latency">
            The engine verifies external egress by establishing a handshake with a global DNS 
            backbone and measuring round-trip packet latency. A response under 50ms indicates 
            high-performance local routing, while metrics under 150ms are standard for mobile or 
            satellite link-states. This machine&apos;s network interface successfully registered a 
            <strong style={{ color: "#00e676" }}> {d.ping_ms}ms latency</strong>. To maintain 
            security during this audit, sensitive L2/L3 identifiers (MAC/IP) remain obfuscated.
          </FindingsBox>
        </Card>
      </div>

      {/* ── System Errors ─────────────────────────────────────────────── */}
      <Card>
        <SectionTitle>System Event Log (48h)</SectionTitle>
        <KV
          k="Critical Errors"
          v={d.system_errors_48h}
          vColor={d.system_errors_48h === 0 ? "#00e676" : d.system_errors_48h <= 3 ? "#ffa726" : "#ef5350"}
        />

        <FindingsBox icon="📋" title="System Reliability & Kernel Telemetry">
          The engine audits the high-priority operational logs (e.g., systemd-journald or Windows 
          Event Logs) to isolate critical interrupts within the last 48-hour window. While a 
          minimal delta (1–3 events) may occur during routine OS maintenance, a volume exceeding 10 
          reports suggests underlying hardware instability, driver regression, or kernel-level conflicts. 
          A machine&apos;s reliability profile here recorded{" "}
          <strong
            style={{
              color: d.system_errors_48h === 0 ? "#00e676" : d.system_errors_48h <= 3 ? "#ffa726" : "#ef5350",
            }}
          >
            {d.system_errors_48h} critical interrupts
          </strong>{" "}
          within the observation period.
        </FindingsBox>
      </Card>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: 11,
          marginTop: 36,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        <p>NextBit Probe v{d.probe_version} · XcognVis · {d.timestamp}</p>
        {d.device_id && (
          <p style={{ marginTop: 4 }}>
            Device ID: {d.device_id} · Scan ID: {d.scan_id ?? "—"}
          </p>
        )}
        <p style={{ marginTop: 4, color: "rgba(255,255,255,.08)" }}>
          OS: {d.os_type} · Arch: {d.os_arch} · Python {d.python_version}
        </p>
      </footer>
    </article>
  );
}