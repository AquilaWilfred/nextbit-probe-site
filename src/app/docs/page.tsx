"use client";

import { useState } from "react";
import Sidebar, { type SidebarSection } from "@/components/layout/Sidebar";
import CodeBlock from "@/components/ui/CodeBlock";
import InfoCallout from "@/components/ui/InfoCallout";
import { SUDO_CHECKS, SCAN_STEPS } from "@/constants";
import styles from "./page.module.css";

const SECTIONS: SidebarSection[] = [
  {
    label: "Technical Specification",
    items: [
      { id: "install", label: "Installation & Architectures" },
      { id: "pipeline", label: "4-Stage Forensic Pipeline" },
      { id: "scoring", label: "Predictive Reliability Scoring" },
      { id: "fingerprinting", label: "Hardware Fingerprinting" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "flags", label: "CLI flags" },
      { id: "output", label: "Output files" },
    ],
  },
  {
    label: "Security",
    items: [
      { id: "security", label: "Ring 0 Access Disclosure" },
      { id: "ci", label: "CI / automation" },
    ],
  },
];

const INSTALL_URL = "https://nextbit.co.ke/probe/nextbit_probe.sh";

const FLAGS = [
  { flag: "--skip-ram",    desc: "Skip the memory stress test. Saves ~30 seconds. Use when speed matters more than RAM verification." },
  { flag: "--skip-smart",  desc: "Skip SMART disk health checks. Useful if the drive controller does not expose SMART data or sudo is unavailable." },
  { flag: "--no-report",   desc: "Print only the raw JSON result to stdout — no HTML file is written. Ideal for piping into other tools or CI systems." },
  { flag: "--output DIR",  desc: "Write all output files to a custom directory instead of the working directory. The directory must already exist." },
  { flag: "--quiet",       desc: "Suppress all progress messages on stdout. Only errors and the final JSON summary are printed. Does not affect the HTML report." },
];

const SCORE_WEIGHTS = [
  { label: "Battery health",            pts: 8,  pct: 85 },
  { label: "Storage (SMART)",           pts: 7,  pct: 75 },
  { label: "Memory (RAM)",              pts: 5,  pct: 55 },
  { label: "CPU / thermal",             pts: 4,  pct: 45 },
  { label: "Firmware / TPM / secure boot", pts: 3, pct: 32 },
  { label: "Display / peripherals",     pts: 1,  pct: 10 },
];

const OUTPUT_FILES = [
  {
    icon: "🗒️",
    name: "nextbit_report_YYYY-MM-DD_HH-MM-SS.html",
    desc: "Human-readable diagnostic report. Open in any browser. Contains the score summary, rating cards, and full hardware table.",
  },
  {
    icon: "📄",
    name: "nextbit_data_YYYY-MM-DD_HH-MM-SS.json",
    desc: "Machine-readable raw data with all subsystem scores and metrics. Use for automation, auditing, or importing into other systems.",
  },
  {
    icon: "📋",
    name: "nextbit_probe.log",
    desc: "Full verbose log of the scan run, including tool output and any errors. Useful for debugging issues on unusual hardware.",
  },
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState("install");
  const [copied, setCopied] = useState(false);

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar sections={SECTIONS} activeId={activeId} onSelect={setActiveId} />

      <div className={styles.content}>
        <div className={styles.headerBar}>
          <h2>Technical Specification</h2>
          <button type="button" className="copy-button" onClick={copyCurrentUrl}>
            {copied ? "URL copied ✓" : "Copy docs link"}
          </button>
        </div>

        {/* ── INSTALLATION ─────────────────────────────────────── */}
        {activeId === "install" && (
          <section>
            <h2>Installation & Architectures</h2>
            <p className={`lead ${styles.lead}`}>
              NextBit Probe installs with one command and runs entirely locally —
              no package manager, no cloud service, no account required.
            </p>
            <InfoCallout type="info">
              Python 3.8 or newer is required. Most modern Linux distros include it by
              default. Check with{" "}
              <code style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>
                python3 --version
              </code>
              .
            </InfoCallout>

            <p className={styles.subHeading}>Universal Wrapper</p>
            <p>
              The installer script detects your operating system and architecture automatically,
              downloading the appropriate binary. It supports x86 (32-bit) and x64 (64-bit)
              architectures across Windows, Linux, and macOS platforms.
            </p>

            <p className={styles.subHeading}>Supported Architectures</p>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>x86 (32-bit)</th>
                    <th>x64 (64-bit)</th>
                    <th>ARM64</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Windows</td>
                    <td>✓ Legacy support</td>
                    <td>✓ Primary target</td>
                    <td>✗ Not supported</td>
                  </tr>
                  <tr>
                    <td>Linux</td>
                    <td>✓ Legacy hardware</td>
                    <td>✓ Primary target</td>
                    <td>✓ Server platforms</td>
                  </tr>
                  <tr>
                    <td>macOS</td>
                    <td>✗ Not supported</td>
                    <td>✓ Intel Macs</td>
                    <td>✓ Apple Silicon</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.subHeading}>Linux / macOS</p>
            <div className={styles.installRow}>
              <CodeBlock
                lang="bash"
                lines={[
                  { type: "comment", text: "# 1. Download the installer script" },
                  { type: "command", text: `wget ${INSTALL_URL}` },
                  { type: "comment", text: "# 2. Make it executable" },
                  { type: "command", text: "chmod +x nextbit_probe.sh" },
                ]}
              />
              <button
                type="button"
                className="copy-button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `wget ${INSTALL_URL}\nchmod +x nextbit_probe.sh`
                  )
                }
              >
                Copy commands
              </button>
            </div>

            <p className={styles.subHeading}>Windows (PowerShell)</p>
            <CodeBlock
              lang="powershell"
              lines={[
                { type: "comment", text: "# Run in an elevated PowerShell window" },
                { type: "command", text: "irm https://nextbit.co.ke/probe/install.ps1 | iex" },
              ]}
            />

            <InfoCallout type="warn">
              Always inspect a script before running it with elevated privileges. The
              NextBit Probe source is public at{" "}
              <strong>nextbit.co.ke</strong> — review it before piping to your shell.
            </InfoCallout>
          </section>
        )}

        {/* ── 4-STAGE FORENSIC PIPELINE ─────────────────────────── */}
        {activeId === "pipeline" && (
          <section>
            <h2>The 4-Stage Forensic Pipeline</h2>
            <p className={`lead ${styles.lead}`}>
              NextBit Probe executes a comprehensive hardware diagnostic pipeline in four distinct stages,
              ensuring cross-architecture compatibility and forensic-grade accuracy across Windows, Linux, and macOS platforms.
            </p>

            <p className={styles.subHeading}>Pipeline Stages</p>
            <ol className={styles.stepList}>
              {SCAN_STEPS.map((s, i) => (
                <li key={i} className={styles.stepItem}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p className={styles.stepDesc}>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <InfoCallout type="info">
              The pipeline is designed to complete in under 90 seconds on modern hardware,
              with parallel execution of independent diagnostic modules for optimal performance.
            </InfoCallout>
          </section>
        )}

        {/* ── CLI FLAGS ────────────────────────────────────────── */}
        {activeId === "flags" && (
          <section>
            <h2>CLI flags</h2>
            <p className={`lead ${styles.lead}`}>
              All flags can be combined. Flags that skip tests reduce scan time; flags
              that change output format are useful in automation pipelines.
            </p>

            <ul className={styles.flagList}>
              {FLAGS.map(({ flag, desc }) => (
                <li key={flag} className={styles.flagItem}>
                  <code className={styles.flagCode}>{flag}</code>
                  <span className={styles.flagDesc}>{desc}</span>
                </li>
              ))}
            </ul>

            <p className={styles.subHeading}>Example — combining flags</p>
            <CodeBlock
              lang="bash"
              lines={[
                { type: "comment", text: "# Fast, quiet scan writing output to a custom folder" },
                { type: "command", text: "sudo ./nextbit_probe.sh --skip-ram --quiet --output /var/reports" },
              ]}
            />
          </section>
        )}

        {/* ── PREDICTIVE RELIABILITY SCORING ───────────────────── */}
        {activeId === "scoring" && (
          <section>
            <h2>Predictive Reliability Scoring</h2>
            <p className={`lead ${styles.lead}`}>
              The total score is out of <strong>28 points</strong>, distributed across
              hardware subsystems using a weighted reliability matrix. This scoring system
              predicts operational risk based on historical failure patterns in enterprise hardware.
            </p>
            <InfoCallout type="tip">
              Battery and disk subsystems receive the highest weighting because they account for
              70% of hardware failures in refurbished machines according to industry reliability data.
            </InfoCallout>

            <p className={styles.subHeading}>Weighting Logic</p>
            <p>
              The 28-point system applies statistical weighting based on mean time between failures (MTBF)
              data from large-scale hardware deployments. Subsystems with higher failure rates receive
              proportionally more weight in the final score calculation.
            </p>

            <ul className={styles.scoreList}>
              {SCORE_WEIGHTS.map(({ label, pts, pct }) => (
                <li key={label} className={styles.scoreItem}>
                  <div className={styles.scoreLabels}>
                    <span>{label}</span>
                    <span className={styles.scorePts}>{pts} / 28 pts</span>
                  </div>
                  <div className={styles.scoreTrack}>
                    <div className={styles.scoreFill} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className={styles.scoreNote}>
              Weight percentages reflect relative impact on overall device reliability.
            </p>
          </section>
        )}

        {/* ── HARDWARE FINGERPRINTING ───────────────────────────── */}
        {activeId === "fingerprinting" && (
          <section>
            <h2>Hardware Fingerprinting</h2>
            <p className={`lead ${styles.lead}`}>
              NextBit Probe generates a unique 32-character device identifier for each scanned machine,
              enabling reliable asset tracking and reconciliation across enterprise deployments.
            </p>

            <p className={styles.subHeading}>Device Identity Generation</p>
            <p>
              The fingerprint combines multiple hardware identifiers including CPU serial numbers,
              motherboard UUIDs, and storage device serials. This creates a stable, unique identifier
              that persists through OS reinstalls and minor hardware changes.
            </p>

            <InfoCallout type="info">
              The 32-character GUID format ensures compatibility with existing asset management
              systems and provides sufficient entropy for unique identification across large fleets.
            </InfoCallout>

            <p className={styles.subHeading}>32-bit vs 64-bit Architecture Support</p>
            <p>
              NextBit Probe maintains full compatibility with legacy 32-bit hardware while optimizing
              for modern 64-bit systems. The diagnostic engine automatically detects architecture
              and applies appropriate testing parameters for accurate reliability assessment.
            </p>
          </section>
        )}

        {/* ── OUTPUT FILES ─────────────────────────────────────── */}
        {activeId === "output" && (
          <section>
            <h2>Output files</h2>
            <p className={`lead ${styles.lead}`}>
              Every scan writes three files to the working directory (or the path set
              by{" "}
              <code style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>
                --output
              </code>
              ). Timestamps in filenames use the local system clock — multiple scans
              will not overwrite each other.
            </p>

            <ul className={styles.outputList}>
              {OUTPUT_FILES.map(({ icon, name, desc }) => (
                <li key={name} className={styles.outputItem}>
                  <span className={styles.outputIcon}>{icon}</span>
                  <div>
                    <code className={styles.outputName}>{name}</code>
                    <p className={styles.outputDesc}>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── RING 0 ACCESS DISCLOSURE ──────────────────────────── */}
        {activeId === "security" && (
          <section>
            <h2>Ring 0 Access Disclosure</h2>
            <p className={`lead ${styles.lead}`}>
              NextBit Probe requires Ring 0 (kernel-level) access to perform comprehensive
              hardware diagnostics. This elevated privilege enables direct communication with
              hardware controllers and firmware interfaces.
            </p>
            <InfoCallout type="warn">
              Always review the source code before executing with elevated privileges. The
              NextBit Probe source is public — read it at <strong>nextbit.co.ke</strong> before
              running with Ring 0 access.
            </InfoCallout>

            <p className={styles.subHeading}>Ring 0 Diagnostics</p>
            <ul className={styles.sudoList}>
              {SUDO_CHECKS.map(({ title, desc }) => (
                <li key={title} className={styles.sudoItem}>
                  <span className={styles.sudoTick}>✓</span>
                  <div>
                    <strong>{title}</strong>
                    <p className={styles.sudoDesc}>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── CI / AUTOMATION ──────────────────────────────────── */}
        {activeId === "ci" && (
          <section>
            <h2>CI / Automation</h2>
            <p className={`lead ${styles.lead}`}>
              NextBit Probe is script-friendly. It exits with a non-zero code if any
              subsystem score falls below the FAIR threshold, making it easy to gate
              automated pipelines on hardware health.
            </p>

            <p className={styles.subHeading}>Fail a pipeline if hardware is degraded</p>
            <CodeBlock
              lang="bash"
              lines={[
                { type: "comment", text: "# Exit 0 = all scores FAIR or better. Non-zero = degraded." },
                { type: "command", text: "sudo ./nextbit_probe.sh --no-report --quiet" },
                { type: "comment", text: "# Gate downstream steps with &&" },
                { type: "command", text: 'sudo ./nextbit_probe.sh --no-report --quiet && echo "Hardware OK"' },
              ]}
            />

            <p className={styles.subHeading}>Parse JSON output in a script</p>
            <CodeBlock
              lang="bash"
              lines={[
                { type: "comment", text: "# Capture JSON and extract the total score with jq" },
                { type: "command", text: "RESULT=$(sudo ./nextbit_probe.sh --no-report --quiet)" },
                { type: "command", text: 'SCORE=$(echo "$RESULT" | jq \'.total_score\')' },
                { type: "command", text: 'echo "Total score: $SCORE / 28"' },
              ]}
            />

            <InfoCallout type="info">
              <code style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>jq</code>{" "}
              must be installed separately. On Debian/Ubuntu:{" "}
              <code style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>
                apt install jq
              </code>
              . The JSON schema is stable across minor versions.
            </InfoCallout>
          </section>
        )}
      </div>
    </div>
  );
}