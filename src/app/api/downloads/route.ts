export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("assetId");

  if (!assetId || !/^\d+$/.test(assetId)) {
    return new Response("Invalid asset ID", { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(
    `https://api.github.com/repos/AquilaWilfred/nextbit-probe-tool/releases/assets/${assetId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/octet-stream",
      },
      redirect: "follow",
    }
  );

  if (!res.ok) return new Response("Download failed", { status: res.status });

  const filename = res.headers.get("content-disposition")
    ?.match(/filename="?([^"]+)"?/)?.[1] || `asset-${assetId}`;

  return new Response(res.body, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}