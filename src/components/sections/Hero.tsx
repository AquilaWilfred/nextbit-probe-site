import Link from "next/link";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { SITE_META } from "@/constants";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <SectionWrapper divided>
      <div className={styles.hero}>
        {/* Left Column: Messaging */}
        <div className={styles.content}>
          <span className="pill">
            <span className={styles.pulse}>●</span> System Engine v{SITE_META.version} Stable
          </span>

          <h1 className={styles.heading}>
            Every machine has a story.
            <span className={styles.accent}>NextBit Probe narrates the unseen.</span>
          </h1>

          <p className={styles.lead}>
            High-Fidelity Hardware, OS and Firmware Forensic & Audit tool. 
            Engineered to extract deep-level telemetry across 64-bit architectures, 
            providing truth from silicon to kernel.
          </p>

          <div className={styles.trustGroup}>
            <div className={styles.trust}>
              <span className={styles.check}>✓</span> 
              <span><strong>Zero-Access Architecture:</strong> Local-first scanning</span>
            </div>
            <div className={styles.trust}>
              <span className={styles.check}>✓</span> 
              <span><strong>Forensic Grade:</strong> SMBIOS, SMART & Firmware extraction</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Action Column */}
        <div className={styles.actions}>
          <Link href="/downloads" className="btn-primary">
            Get NextBit Probe
          </Link>
          <Link href="/docs" className="btn-secondary">
            Technical Specs →
          </Link>
          
          <div className={styles.miniStats}>
            <div className={styles.statItem}>
              <span>Architecture</span>
              <strong>X64_READY</strong>
            </div>
            <div className={styles.statItem}>
              <span>Deployment</span>
              <strong>ZERO_INSTALL</strong>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}