import styles from "./SectionWrapper.module.css";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Adds a bottom border divider */
  divided?: boolean;
  /** Max-width cap */
  narrow?: boolean;
}

export default function SectionWrapper({
  children,
  className = "",
  divided = false,
  narrow = false,
}: SectionWrapperProps) {
  return (
    <section
      className={`${styles.wrapper} ${divided ? styles.divided : ""} ${narrow ? styles.narrow : ""} ${className}`}
    >
      {children}
    </section>
  );
}
