function parseChecksums(text: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      const hash = parts[0];
      const file = parts[parts.length - 1].replace(/^.*[\\/]/, "");
      map[file] = hash;
    }
  }
  return map;
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return Response.json(
        { error: "GITHUB_TOKEN not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://api.github.com/repos/AquilaWilfred/nextbit-probe-tool/releases/latest",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Fetch and parse checksum.txt on the server to avoid CORS issues
    let checksums: Record<string, string> = {};
    const checksumAsset = data.assets.find((a: { name: string }) => a.name === "checksum.txt");
    if (checksumAsset) {
      try {
        const cRes = await fetch(checksumAsset.browser_download_url);
        if (cRes.ok) {
          checksums = parseChecksums(await cRes.text());
        }
      } catch (checksumErr: unknown) {
        console.warn("Failed to fetch checksum.txt:", checksumErr);
      }
    }

    return Response.json({ ...data, checksums });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch releases";
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
