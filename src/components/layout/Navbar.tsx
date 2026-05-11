"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_META } from "@/constants";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <Link href="/" className={styles.logo} aria-label={SITE_META.name}>
        <Image
          src="/NextBitProbe_logo.png"
          alt="NextBit Probe Logo"
          width={28}
          height={28}
          className={styles.logomark}
        />
        <span className={styles.logotype}>
          NextBit<span className={styles.accent}>Probe</span>
        </span>
      </Link>

      <div className={styles.links} role="list">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            role="listitem"
            className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={styles.actions}>
        <ThemeToggle />
        <Link href="/downloads" className="btn-primary" style={{ fontSize: 12, padding: "7px 14px" }}>
          Download
        </Link>
      </div>
    </nav>
  );
}
