import { FEATURES } from "@/constants";
import SectionWrapper from "@/components/layout/SectionWrapper";
import styles from "./FeatureGrid.module.css";

export default function FeatureGrid() {
  return (
    <SectionWrapper divided>
      <h2 className={styles.heading}>What gets scanned</h2>
      <div className={styles.grid}>
        {FEATURES.map((feat) => (
          <div key={feat.title} className={`card ${styles.feat}`}>
            <div
              className={styles.iconWrap}
              style={{ background: feat.accentColor }}
              aria-hidden="true"
            >
              {feat.icon}
            </div>
            <h3 className={styles.title}>{feat.title}</h3>
            <p className={styles.desc}>{feat.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
