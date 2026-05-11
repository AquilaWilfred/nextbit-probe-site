import type { ChangelogEntry } from "@/types";
import styles from "./ChangelogList.module.css";

const LABEL_CLASS: Record<ChangelogEntry["label"], string> = {
  latest: styles.labelLatest,
  stable: styles.labelStable,
  old: styles.labelOld,
};

export default function ChangelogList({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className={styles.list}>
      {entries.map((entry) => (
        <div key={entry.version} className={styles.entry}>
          <div className={styles.header}>
            <span className={`mono ${styles.version}`}>{entry.version}</span>
            <span className={`${styles.label} ${LABEL_CLASS[entry.label]}`}>
              {entry.label}
            </span>
            <span className={`hint ${styles.date}`}>{entry.date}</span>
          </div>
          <ul className={styles.notes}>
            {entry.notes.map((note, i) => (
              <li key={i} className={styles.note}>{note}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
