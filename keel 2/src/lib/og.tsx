import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "Keel — Your project. Our responsibility.";

/**
 * Open Graph / Twitter image, generated at build time.
 * Kept in English for both locales: the default OG font has no Cyrillic glyphs.
 */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(ellipse at 20% 0%, #13213d 0%, #05070b 60%)",
          color: "#edf1f7",
          fontFamily: "sans-serif",
          borderTop: "6px solid #8fb4ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8" stroke="#253042" strokeWidth="1.5" />
            <path d="M11 6.5v13" stroke="#edf1f7" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M21.5 6.5L11.8 14.5l9.7 7" stroke="#edf1f7" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 19.5v6" stroke="#8fb4ff" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>Keel</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Your project.</div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05, color: "#a9c4ff" }}>
            Our responsibility.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#98a3b3" }}>
          <div>Software development agency</div>
          <div>Web · Mobile · SaaS · AI · Automation</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
