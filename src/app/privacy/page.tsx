"use client";

import SectionWrapper from "@/components/layout/SectionWrapper";
import styles from "./page.module.css";

// Note: In Next.js 13+ metadata must be in a Server Component or handled via separate file.
// If this is a client component, move metadata to a layout or a parent server component.

const DATA_TABLE = [
  { collected: "Machine Fingerprint", where: "Local Storage", why: "Synthesized GUID for asset reconciliation" },
  { collected: "Kernel Telemetry", where: "Volatile Memory", why: "Real-time performance and thermal analysis" },
  { collected: "L2/L3 Identifiers", where: "Local Report", why: "Interface mapping for local network audits" },
  { collected: "S.M.A.R.T. Logs", where: "Local Disk", why: "NAND endurance and predictive failure scoring" },
  { collected: "DMI Table Data", where: "Local Report", why: "Verifying BIOS age and manufacturer firmware support" },
];

const NEVER_LIST = [
  "Execute external network egress (Zero-Call Home)",
  "Store PII (Personally Identifiable Information)",
  "Collect usage metrics or analytics pings",
  "Ship logs to centralized cloud repositories",
  "Require persistent internet for engine execution",
];

const SECURITY_CARDS = [
  {
    icon: "🛡️",
    color: "rgba(0,242,255,0.12)",
    title: "Air-Gapped Compliance",
    desc: "The diagnostic engine is designed to operate in isolated environments. No data leaves the local execution context.",
  },
  {
    icon: "🏗️",
    color: "rgba(0,200,83,0.12)",
    title: "Zero-Knowledge Logic",
    desc: "Reports are generated locally via HTML injection. We have zero visibility into your hardware profile or audit results.",
  },
  {
    icon: "🔍",
    color: "rgba(157,80,187,0.12)",
    title: "Binary Transparency",
    desc: "Every build is verifiable. Inspect the raw source to confirm there are no hidden sockets or telemetry hooks.",
  },
];

export default function PrivacyPage() {
  return (
    <SectionWrapper className={styles.privacyWrapper}>
      <div className={styles.intro}>
        <h2>Forensic Privacy & Data Disclosure</h2>
        <p>
          NextBit Probe adheres to a **Zero-Egress** security model. Unlike cloud-based diagnostic tools, 
          our engine executes entirely within your local memory space. We prioritize forensic integrity over 
          data harvesting—ensuring your machine&apos;s security posture remains confidential.
        </p>
      </div>

      <div className={styles.splitRow}>
        <div className={styles.cardWrap}>
          <h3 className={styles.subheading}>Telemetry Audit</h3>
          <div className="card" style={{ overflow: "hidden" }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subsystem Data</th>
                    <th>Persistence</th>
                    <th>Audit Intent</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_TABLE.map((row) => (
                    <tr key={row.collected}>
                      <td>{row.collected}</td>
                      <td style={{ color: "var(--emerald)" }}>{row.where}</td>
                      <td style={{ color: "var(--muted)" }}>{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.cardWrap}>
          <h3 className={styles.subheading}>Negative Constraints (Hard Blocks)</h3>
          <div className="card" style={{ padding: 20, minHeight: 240 }}>
            <ul className={styles.neverList} aria-label="Privacy hard blocks">
              {NEVER_LIST.map((item) => (
                <li key={item} className={styles.neverItem}>
                  <span style={{ color: "var(--orange)" }}>✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <h3 className={styles.subheading} style={{ marginTop: 24 }}>System Integrity Guarantees</h3>
      <div className={styles.secCards}>
        {SECURITY_CARDS.map((card) => (
          <div key={card.title} className={`card ${styles.secCard}`}>
            <div className={styles.secIcon} style={{ background: card.color }} aria-hidden="true">
              {card.icon}
            </div>
            <div>
              <h3 style={{ marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 32, padding: 20, background: "rgba(0,242,255,0.03)", border: "1px solid rgba(0,242,255,0.1)" }}>
        <h4 style={{ marginBottom: 8, color: "var(--cyan)" }}>Technical Note on Elevated Permissions</h4>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          A machine&apos;s hardware registers (SMART, DMI, ACPI) are protected by the OS kernel. 
          Running the Probe with <code>sudo</code> or <code>Administrator</code> rights is required 
          to access these low-level descriptors. We encourage users to audit our network activity using 
          tools like <code>tcpdump</code> or <code>Wireshark</code> during a scan—you will find <strong>zero outbound 
          packets </strong> originating from our binary.
        </p>
      </div>

      <p style={{ fontSize: 13, color: "var(--hint)", marginTop: 26 }}>
        Compliance or Security Inquiries: {' '}
        <a href="mailto:clinton@nextbit.co.ke" style={{ color: "var(--cyan)" }}>
          wilfredaquila@gmail.com
        </a>
      </p>
    </SectionWrapper>
  );
}