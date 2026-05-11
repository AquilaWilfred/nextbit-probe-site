"use client";

import styles from "./Sidebar.module.css";

export interface SidebarSection {
  label: string;
  items: { id: string; label: string }[];
}

interface SidebarProps {
  sections: SidebarSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ sections, activeId, onSelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Documentation navigation">
      {sections.map((sec) => (
        <div key={sec.label} className={styles.section}>
          <span className={styles.sectionLabel}>{sec.label}</span>
          {sec.items.map((item) => (
            <button
              key={item.id}
              className={`${styles.item} ${activeId === item.id ? styles.active : ""}`}
              onClick={() => onSelect(item.id)}
              aria-current={activeId === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}
