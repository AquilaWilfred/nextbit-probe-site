"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import styles from "./ScanReportShowcase.module.css";

const REPORT_SECTIONS = [
  {
    id: "overview",
    title: "Executive Audit Summary",
    subtitle: "High-level hardware health score and machine fingerprinting",
    image: "/report images/probe_overview.png",
    description:
      "A machine's audit begins with a real-time health score calculation and unique hardware fingerprinting. This section provides an immediate snapshot of asset viability and scan integrity.",
  },
  {
    id: "os-perf",
    title: "Kernel & Performance Telemetry",
    subtitle: "OS kernel state, architecture, and resource overhead",
    image: "/report images/os_and_performance.png",
    description:
      "Captures OS build specifics and idle-state telemetry. It audits startup service density and CPU frequency scaling to identify software-layer bottlenecks or persistent bloatware.",
  },
  {
    id: "check",
    title: "Diagnostic Pass/Fail Matrix",
    subtitle: "Automated verification of critical hardware subsystems",
    image: "/report images/check_results.png",
    description:
      "A consolidated verification grid for battery, storage, memory, and security. It provides an instant visual audit of which subsystems meet the NextBit stability baseline.",
  },
  {
    id: "details1",
    title: "Thermal & Computational Profile",
    subtitle: "CPU microarchitecture, frequency stability, and sensor mapping",
    image: "/report images/other_details1.png",
    description:
      "Deep-dive into CPU thermal headroom and frequency throttle testing. This section maps per-core temperatures and ACPI sensor data to evaluate cooling efficiency.",
  },
  {
    id: "details2",
    title: "Storage & Battery Analytics",
    subtitle: "NAND endurance, S.M.A.R.T. telemetry, and chemical wear",
    image: "/report images/other_details2.png",
    description:
      "Analyzes SSD wear-leveling, reallocated sectors, and battery cycle counts. Essential for predicting the Mean Time Between Failure (MTBF) for mobile and storage assets.",
  },
  {
    id: "details3",
    title: "Security & Interface Audit",
    subtitle: "Cryptographic TPM status, Secure Boot, and peripheral inventory",
    image: "/report images/other_details3.png",
    description:
      "Verifies the machine's security posture, including TPM 2.0 readiness and endpoint protection. Includes a full peripheral audit (USB, BT, Camera) for comprehensive asset tracking.",
  },
];

export default function ScanReportShowcase() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  return (
    <SectionWrapper divided>
      <div className={styles.header}>
        <div>
          <h2>Forensic-Grade Diagnostic Reporting</h2>
          <p className={styles.intro}>
            NextBit Probe generates authoritative, tamper-evident hardware audits. 
            Each report synthesizes thousands of telemetry data points into an 
            actionable health assessment for IT asset reconciliation.
          </p>
        </div>
        <div className={styles.logoContainer}>
          <Image
            src="/NextBitProbe_logo.png"
            alt="NextBit Probe Diagnostic Engine"
            width={140}
            height={140}
            quality={85}
            className={styles.logo}
          />
        </div>
      </div>

      <div className={styles.showcase}>
        {REPORT_SECTIONS.map((section, idx) => (
          <div key={section.id} className={`${styles.section} ${idx % 2 === 0 ? styles.even : styles.odd}`}>
            <div className={styles.content}>
              <div className={styles.badge}>{idx + 1}</div>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={styles.subtitle}>{section.subtitle}</p>
              <p className={styles.description}>{section.description}</p>
            </div>
            <div className={styles.imageWrapper}>
              <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                <Image
                  src={section.image}
                  alt={`${section.title} - NextBit Probe Hardware Scan`}
                  width={480}
                  height={360}
                  quality={80}
                  className={styles.reportImage}
                  onClick={() => setSelectedImage(section.image)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedImage(section.image)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomCta}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 8 }}>Ready to audit your hardware?</h3>
          <p style={{ marginBottom: 16, color: "var(--muted)" }}>
            Join the NextBit community. Download the probe to generate local, 
            high-fidelity diagnostic reports in seconds.
          </p>
          <a href="/downloads" className="btn-primary">
            Download the Probe →
          </a>
        </div>
      </div>

      {selectedImage && (
        <div className={styles.modal} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalOverlay} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedImage(null)}
              aria-label="Close Preview"
            >
              ✕
            </button>
            <Image
              src={selectedImage}
              alt="High-resolution NextBit Probe Report Preview"
              width={1200}
              height={900}
              quality={95}
              className={styles.modalImage}
              priority
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}