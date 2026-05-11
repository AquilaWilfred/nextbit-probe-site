import Link from "next/link";
import { NAV_LINKS, SITE_META } from "@/constants";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.about}>
        <span className={styles.copy}>
          {SITE_META.name} {SITE_META.version} © {new Date().getFullYear()}
        </span>
        <p className={styles.description}>
          Local-first diagnostics for refurbished hardware and enterprise fleets.
          No cloud upload, no surprise telemetry.
        </p>
      </div>
      <div className={styles.footerRight}>
        <nav className={styles.links} aria-label="Footer navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <span className={styles.help}>Need enterprise access? Visit <Link href="/contact">Contact</Link></span>
      </div>
    </footer>
  );
}
