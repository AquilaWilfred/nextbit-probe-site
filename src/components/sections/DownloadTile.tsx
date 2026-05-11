import type { DownloadRelease } from "@/types";
import styles from "./DownloadTile.module.css";

const PLATFORM_LABELS: Record<DownloadRelease["platform"], string> = {
  linux: "Linux",
  windows: "Windows",
  macos: "macOS",
};

const PLATFORM_ICONS: Record<DownloadRelease["platform"], string> = {
  linux: "🐧",
  windows: "🪟",
  macos: "🍎",
};

export default function DownloadTile({ release }: { release: DownloadRelease }) {
  const archLabel = release.arch ? `${release.arch.toUpperCase()} build` : "Standard build";

  return (
    <div className={`card ${styles.tile}`}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden="true">
          {PLATFORM_ICONS[release.platform]}
        </span>
        <div>
          <h3 className={styles.platform}>{PLATFORM_LABELS[release.platform]}</h3>
          <span className={`mono hint ${styles.version}`}>{release.version}</span>
        </div>
      </div>

      <div className={styles.badgeRow}>
        <span className={styles.arch}>{archLabel}</span>
        <span className={`mono ${styles.version}`}>{release.releaseDate}</span>
      </div>

      <dl className={styles.meta}>
        <div className={styles.metaRow}>
          <dt className="hint">Size</dt>
          <dd className="mono">{release.fileSize}</dd>
        </div>
        <div className={styles.checksumRow}>
          <dt className="hint">SHA-256</dt>
          <dd className={`mono ${styles.checksum}`}>{release.checksum}</dd>
        </div>
      </dl>

      <a href={release.downloadUrl} download className="btn-primary" style={{ justifyContent: "center" }}>
        ↓ Download
      </a>
    </div>
  );
}
