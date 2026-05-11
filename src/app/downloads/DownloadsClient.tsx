"use client";

import { useState, useEffect } from "react";
import type { DownloadRelease } from "@/types";
import DownloadTile from "@/components/sections/DownloadTile";
import ChangelogList from "@/components/sections/ChangelogList";
import InfoCallout from "@/components/ui/InfoCallout";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { CHANGELOG } from "@/constants";
import styles from "./page.module.css";

const ENTERPRISE_KEY = "NB-AQUILA12";

const ENTERPRISE_DOWNLOADS: DownloadRelease[] = [
  {
    platform: "linux",
    arch: "universal",
    version: "v4.0.0-enterprise",
    checksum: "sha256:eeffcc99887766554433221100aabbcc",
    fileSize: "3.7 MB",
    downloadUrl: "/downloads/nextbit_probe_enterprise_linux_universal.sh",
    releaseDate: "2026-05-08",
  },
  {
    platform: "windows",
    arch: "universal",
    version: "v4.0.0-enterprise",
    checksum: "sha256:7766554433221100ffeeddccbbaa9988",
    fileSize: "4.9 MB",
    downloadUrl: "/downloads/nextbit_probe_enterprise_windows_universal.exe",
    releaseDate: "2026-05-08",
  },
  {
    platform: "macos",
    arch: "universal",
    version: "v4.0.0-enterprise",
    checksum: "sha256:112233445566778899aabbccddeeff00",
    fileSize: "4.2 MB",
    downloadUrl: "/downloads/nextbit_probe_enterprise_macos_universal.pkg",
    releaseDate: "2026-05-08",
  },
];

// ─── Map a GitHub asset filename to a DownloadRelease ────────────────────────
function mapAsset(asset: {
  name: string;
  size: number;
  browser_download_url: string;
  created_at: string;
}, tagName: string, checksums: Record<string, string>): DownloadRelease | null {
  const n = asset.name;

  // skip checksum file itself
  if (n === "checksum.txt") return null;

  const platform: DownloadRelease["platform"] =
    n.includes("linux")   ? "linux"
    : n.includes("windows") ? "windows"
    : n.includes("macos")   ? "macos"
    : null!;

  if (!platform) return null;

  const arch: DownloadRelease["arch"] =
    n.includes("x86")       ? "x86"
    : n.includes("x64")     ? "x64"
    : n.includes("arm64")   ? "arm64"
    : n.includes("universal") ? "universal"
    : undefined;

  return {
    platform,
    arch,
    version: tagName,
    checksum: checksums[n] ? `sha256:${checksums[n]}` : "",
    fileSize: `${(asset.size / 1024 / 1024).toFixed(1)} MB`,
    downloadUrl: asset.browser_download_url,
    releaseDate: asset.created_at.split("T")[0],
  };
}

// ─── Parse checksum.txt into a filename → hash map ───────────────────────────
// NOTE: This is now handled server-side in /api/releases

export default function DownloadsClient() {
  const [ownerKey, setOwnerKey]     = useState("");
  const [downloads, setDownloads]   = useState<DownloadRelease[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const isOwnerKeyValid = ownerKey.trim().toUpperCase() === ENTERPRISE_KEY;

  useEffect(() => {
    async function fetchRelease() {
      try {
        const res = await fetch("/api/releases");

        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const release = await res.json();

        // checksums are already parsed on the server
        const checksums = release.checksums || {};

        const mapped: DownloadRelease[] = release.assets
          .map((a: { name: string; size: number; browser_download_url: string; created_at: string }) => mapAsset(a, release.tag_name, checksums))
          .filter(Boolean) as DownloadRelease[];

        setDownloads(mapped);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load releases";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchRelease();
  }, []);

  return (
    <>
      <SectionWrapper divided>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ marginBottom: 8 }}>Binary Distribution & Releases</h2>
            <p style={{ marginBottom: 16, maxWidth: 620 }}>
              Access platform-optimized binaries for <strong>NextBit Probe</strong>. Standard builds are segmented by
              architecture (x86/x64), while Enterprise packages provide universal compatibility and extended telemetry.
            </p>
          </div>
          <div style={{ minWidth: 220 }}>
            <p style={{ fontSize: 12, color: "var(--hint)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.05em" }}>
              ENTERPRISE AUTHENTICATION
            </p>
            <input
              className="field-input"
              value={ownerKey}
              onChange={(e) => setOwnerKey(e.target.value)}
              placeholder="Enter Owner Key..."
              aria-label="Enterprise owner key"
              style={{ width: "100%", minWidth: 220, border: isOwnerKeyValid ? "1px solid var(--success)" : "" }}
            />
          </div>
        </div>

        <InfoCallout type="info">
          Standard releases are architecture-specific. For automated deployment across mixed-ISA fleets,
          use the <strong>Enterprise Universal Binaries</strong> unlocked via the owner key.
        </InfoCallout>

        {loading && (
          <p style={{ color: "var(--muted)", padding: "24px 0" }}>Loading latest release…</p>
        )}

        {error && (
          <p style={{ color: "var(--error)", padding: "24px 0" }}>
            Could not load releases: {error}
          </p>
        )}

        {!loading && !error && (
          <div className={styles.grid}>
            {downloads.map((release) => (
              <DownloadTile
                key={`${release.platform}-${release.arch}-${release.version}`}
                release={release}
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper divided>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ marginBottom: 8 }}>Fleet & Enterprise Tooling</h2>
            <p style={{ marginBottom: 10, maxWidth: 620 }}>
              Enterprise builds are engineered for <strong>IT Asset Management (ITAM)</strong>. They include
              unfiltered S.M.A.R.T. access, advanced kernel-level hooks, and headless automation support.
            </p>
          </div>
          {isOwnerKeyValid && (
            <span style={{ fontSize: 12, color: "var(--success)", background: "rgba(0,230,118,0.1)", border: "1px solid var(--success)", borderRadius: 16, padding: "6px 12px" }}>
              Enterprise Access Granted
            </span>
          )}
        </div>

        {isOwnerKeyValid ? (
          <div className={styles.grid}>
            {ENTERPRISE_DOWNLOADS.map((release) => (
              <DownloadTile
                key={`${release.platform}-${release.arch}-${release.version}`}
                release={release}
              />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 32, marginTop: 14, textAlign: "center", borderStyle: "dashed" }}>
            <h3 style={{ marginBottom: 12 }}>Enterprise Access Required</h3>
            <p style={{ marginBottom: 12, color: "var(--muted)", maxWidth: "500px", margin: "0 auto 16px" }}>
              The <strong>Enterprise Engine</strong> features universal binary support (32-bit/64-bit auto-switching) and
              enhanced forensic audit capabilities for professional fleets.
            </p>
            <p style={{ fontSize: 13, color: "var(--cyan)" }}>
              Use public test key: <strong>{ENTERPRISE_KEY}</strong>
            </p>
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper>
        <h2 style={{ marginBottom: 16 }}>Evolutionary Changelog</h2>
        <div className="card" style={{ overflow: "hidden" }}>
          <ChangelogList entries={CHANGELOG} />
        </div>
      </SectionWrapper>
    </>
  );
}