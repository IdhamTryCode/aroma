import { ImageResponse } from "next/og";
import { ACCORD_LABELS } from "@/lib/accords";
import { loadResult } from "@/lib/store";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DNA Aroma Kamu";

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadResult(id);
  const dna = data?.explanation.dnaSummary ?? "Temukan parfum yang paling kamu banget.";
  const accords = (data?.profile.topAccords ?? []).slice(0, 5).map((a) => ACCORD_LABELS[a]);
  const top = data?.recommendations[0];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#ffffff",
          padding: "72px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#0066cc", letterSpacing: "-1px" }}>
          aroma
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#6e6e73", marginBottom: 18 }}>DNA Aroma Kamu</div>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 600,
              color: "#1d1d1f",
              lineHeight: 1.12,
              letterSpacing: "-1.5px",
            }}
          >
            {truncate(dna, 118)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            {accords.map((a) => (
              <div
                key={a}
                style={{
                  display: "flex",
                  background: "#f5f5f7",
                  color: "#1d1d1f",
                  padding: "8px 20px",
                  borderRadius: 999,
                  fontSize: 24,
                }}
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#6e6e73" }}>
              {top ? "Rekomendasi teratas" : "aroma.cfd"}
            </div>
            {top ? (
              <div style={{ display: "flex", fontSize: 34, fontWeight: 600, color: "#1d1d1f", marginTop: 4 }}>
                {top.perfume.brand} {top.perfume.name}
              </div>
            ) : null}
          </div>
          {top ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: "#0066cc" }}>{top.score}%</div>
              <div style={{ display: "flex", fontSize: 22, color: "#6e6e73" }}>cocok</div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
