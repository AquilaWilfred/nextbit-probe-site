"use client";

import SectionWrapper from "@/components/layout/SectionWrapper";
import ContactForm from "@/components/forms/ContactForm";
import styles from "./page.module.css";

const CHANNELS = [
  {
    href: "https://wa.me/254112554165",
    icon: "⚡",
    iconBg: "rgba(0,200,83,0.12)",
    iconColor: "#00C853",
    title: "Instant Support",
    desc: "Direct access for real-time diagnostic help or urgent troubleshooting.",
    tag: "Priority Response",
    tagStyle: { background: "rgba(0,200,83,0.1)", color: "var(--emerald)" },
  },
  {
    href: "mailto:wilfredaquila@gmail.com",
    icon: "🛡️",
    iconBg: "rgba(0,242,255,0.1)",
    iconColor: "var(--cyan)",
    title: "Enterprise Inquiries",
    desc: "Fleet licensing, volume audits, and custom forensic integration requests.",
    tag: "Official Correspondence",
    tagStyle: { background: "rgba(0,242,255,0.08)", color: "var(--cyan)" },
  },
  {
    href: "https://github.com/AquilaWilfred",
    icon: "🛠️",
    iconBg: "rgba(138,150,176,0.1)",
    iconColor: "var(--muted)",
    title: "Developer Portal",
    desc: "Contribute to the probe engine or report architectural anomalies.",
    tag: "Open Source Audit",
    tagStyle: { background: "var(--surface)", color: "var(--muted)" },
  },
];

export default function ContactPage() {
  return (
    <SectionWrapper>
      <div className={styles.topSection}>
        <div>
          <h2>System Support & Engineering</h2>
          <p className={styles.intro}>
            Whether you are auditing a single machine or managing a cross-continental 
            hardware fleet, our engineering team is available to assist with 
            telemetry interpretation and deployment strategy.
          </p>
        </div>
        <div className={styles.quickInfo}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            Systems Operational
          </div>
          <p className={styles.quickTitle}>Evaluation Access</p>
          <p className={styles.quickText}>
            Use <strong>NB-AQUILA12</strong> for immediate enterprise testing. 
            For production-grade keys, please initiate a request below.
          </p>
        </div>
      </div>

      <div className={styles.gridWrap}>
        <div className={styles.channelGrid}>
          {CHANNELS.map((ch) => (
            <a
              key={ch.title}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`card ${styles.channel}`}
            >
              <div className={styles.channelIcon} style={{ background: ch.iconBg }} aria-hidden="true">
                <span style={{ color: ch.iconColor, fontSize: 22 }}>{ch.icon}</span>
              </div>
              <div>
                <h3 className={styles.channelTitle}>{ch.title}</h3>
                <p className={styles.channelDesc}>{ch.desc}</p>
              </div>
              <span className={styles.channelTag} style={ch.tagStyle}>{ch.tag}</span>
            </a>
          ))}
        </div>

        <div className={styles.formColumn}>
          <div className={`card ${styles.infoCard}`} style={{ borderLeft: '4px solid var(--cyan)' }}>
            <h3 style={{ color: 'var(--cyan)', marginBottom: 12 }}>Fleet Support Request</h3>
            <p style={{ fontSize: 14, marginBottom: 16 }}>
              Scaling your hardware verification? Specify your environment (Refurbishing, ITAD, 
              Corporate IT) to help us tailor our response to your workflow.
            </p>
            <ul className={styles.bulletList}>
              <li>Custom JSON Schema integration</li>
              <li>High-volume licensing for refurbishment centers</li>
              <li>White-labeled HTML audit reports</li>
              <li>Direct Engineering-to-Engineering support</li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </div>

      <div className={styles.footerNote}>
        <p>
          NextBit Probe is a product of <b>NextBit Technology</b>.
          Auditing thousands of devices globally.
        </p>
      </div>
    </SectionWrapper>
  );
}