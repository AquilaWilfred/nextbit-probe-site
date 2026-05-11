import type { Feature, DownloadRelease, ChangelogEntry } from "@/types";

export const FEATURES: Feature[] = [
  {
    icon: "🖥️",
    title: "Kernel-Level CPU Analysis",
    description:
      "Forensic throttle detection, sustained MHz under sustained load, thermal headroom, and core-level clock telemetry — not just a speed test.",
    accentColor: "rgba(0,242,255,0.12)",
  },
  {
    icon: "🔋",
    title: "Battery Wear & Capacity",
    description:
      "NAND-accurate wear percentage, cycle count, and full-charge capacity vs. OEM design spec — essential for resale grading and asset reconciliation.",
    accentColor: "rgba(0,200,83,0.12)",
  },
  {
    icon: "💾",
    title: "SMART Disk Intelligence",
    description:
      "Power-on hours, reallocated sector count, uncorrectable read errors, and SSD NAND endurance — across all attached drives simultaneously.",
    accentColor: "rgba(255,107,0,0.12)",
  },
  {
    icon: "🧠",
    title: "Memory Integrity Test",
    description:
      "Block-level write/read verification across up to 1 GB of live RAM with precise error counts — detects instability that benchmarks miss.",
    accentColor: "rgba(157,80,187,0.12)",
  },
  {
    icon: "🌡️",
    title: "Thermal Sensor Mapping",
    description:
      "Per-sensor temperature telemetry: ACPI zones, PCH, CPU package, and per-core data — pinpoints thermal throttle sources before they become failures.",
    accentColor: "rgba(255,107,0,0.12)",
  },
  {
    icon: "🔒",
    title: "Security Baseline Audit",
    description:
      "TPM version, Secure Boot state, firewall status, AV detection, BitLocker, and OS activation — full security posture in a single pass.",
    accentColor: "rgba(0,85,255,0.12)",
  },
  {
    icon: "📡",
    title: "Network & Identity Telemetry",
    description:
      "Wi-Fi signal strength (dBm), internet latency, MAC address fingerprinting, and active interface enumeration — supports fleet asset reconciliation.",
    accentColor: "rgba(0,217,192,0.12)",
  },
  {
    icon: "📊",
    title: "Forensic-Grade HTML Reports",
    description:
      "Generates a signed, offline-ready HTML report with QR audit codes, device ID, and a weighted health score — shareable without any cloud dependency.",
    accentColor: "rgba(0,242,255,0.08)",
  },
];

// Downloads are fetched dynamically from GitHub Releases at runtime.
// This array is intentionally empty — see src/app/downloads/DownloadsClient.tsx
export const DOWNLOADS: DownloadRelease[] = [];

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v0.0.1",
    date: "May 2026",
    label: "latest",
    notes: [
      "Device classification engine: Laptop, Desktop, Server, VM detection via SMBIOS chassis type + OS ProductType",
      "Virtualization detection (systemd-detect-virt, CPUID hypervisor bit, BIOS vendor heuristics)",
      "ECC RAM detection via dmidecode and WMI TypeDetail",
      "RAID / SAS controller enumeration across all platforms",
      "Forensic-grade HTML report with weighted health score, category breakdown bars, and QR audit codes",
      "Battery NAND wear analysis with design vs full-charge capacity delta",
      "Full SMART attribute table across all attached drives (/dev/sd*, /dev/nvme*)",
      "Thermal sensor mapping: ACPI, PCH, per-core telemetry",
      "Security baseline audit: TPM, Secure Boot, Firewall, AV, BitLocker",
      "Per-scan owner key prompt with saved default — gateway returns previous scan history",
    ],
  },
];

export const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Docs",      href: "/docs" },
  { label: "Downloads", href: "/downloads" },
  { label: "Privacy",   href: "/privacy" },
  { label: "Contact",   href: "/contact" },
] as const;

export const SITE_META = {
  name:    "NextBit Probe",
  version: "v0.0.1",

  // Short tagline — used in og:title, hero H1 sub-text, and nav tooltips.
  tagline: "Forensic hardware diagnostics for IT professionals and device resellers",

  // Google meta description — optimised for 155 characters.
  description:
    "NextBit Probe scans CPU, RAM, SMART disk, battery wear, thermals & security baseline locally — forensic-grade HTML report, no cloud dependency.",

  // Open Graph / Twitter card description.
  ogDescription:
    "Run a full hardware diagnostic on any Windows, Linux, or macOS machine. NextBit Probe checks CPU throttle, NAND endurance, battery wear, memory integrity, TPM, Secure Boot, and more — then produces a signed HTML report with QR audit codes for fleet asset reconciliation.",

  // Structured data keywords (JSON-LD, not visible to users).
  schemaKeywords: [
    "hardware diagnostic tool",
    "laptop health check",
    "SMART disk analysis",
    "battery wear percentage",
    "CPU thermal throttle detection",
    "memory integrity test",
    "security baseline audit",
    "TPM check",
    "forensic hardware report",
    "IT asset reconciliation",
    "fleet device management",
    "refurbished laptop grading",
    "NAND endurance",
    "ECC RAM detection",
    "device fingerprinting",
  ],
} as const;

// ─── Docs page content ────────────────────────────────────────────────────────

export const SUDO_CHECKS = [
  {
    title: "L2 Storage Telemetry (S.M.A.R.T.)",
    desc: "Direct controller queries for NAND endurance, reallocated sectors, and operational lifecycle hours.",
  },
  {
    title: "Kernel-Level Power Diagnostics",
    desc: "Extraction of battery chemistry, cycle counts, and discharge curves directly from the ACPI subsystem.",
  },
  {
    title: "Cryptographic Module Audit",
    desc: "Verification of TPM 2.0 PCR registers and Secure Boot enforcement state via the kernel security layer.",
  },
  {
    title: "DMI/SMBIOS Table Mapping",
    desc: "Accessing system firmware tables to identify BIOS age, manufacturer-specific hardware revisions, and OEM fingerprints.",
  },
];

export const SCAN_STEPS = [
  {
    title: "Bus Enumeration",
    desc: "The engine maps the PCI/USB bus to identify CPU microarchitecture, RAM topology, and storage controllers.",
  },
  {
    title: "Stress & Parity Verification",
    desc: "Executing a 10-second computational stress loop to measure thermal headroom and memory bit-level integrity.",
  },
  {
    title: "Weighting Logic Calculation",
    desc: "The System Engine applies a 28-point weighted reliability matrix to quantify the machine's operational risk level.",
  },
  {
    title: "Forensic Synthesis",
    desc: "Aggregating telemetry into a localized JSON database and a shareable, tamper-evident HTML audit report.",
  },
];

// ─── Contact ──────────────────────────────────────────────────────────────────

export const CONTACT_INFO = {
  url:      "https://nextbit.co.ke",
  email:    "wilfredaquila@gmail.com",
  whatsapp: "https://wa.me/254112554165",
  github:   "https://github.com/AquilaWilfred",
} as const;