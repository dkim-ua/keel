/**
 * Country calling codes (ISO 3166-1 alpha-2 → E.164 country code).
 * Names are not stored here: they are rendered with Intl.DisplayNames
 * in the visitor's language, so the list stays small and always localized.
 */
const RAW =
  "AF93 AX358 AL355 DZ213 AS1684 AD376 AO244 AI1264 AG1268 AR54 AM374 AW297 AU61 AT43 AZ994 BS1242 BH973 BD880 " +
  "BB1246 BY375 BE32 BZ501 BJ229 BM1441 BT975 BO591 BA387 BW267 BR55 IO246 VG1284 BN673 BG359 BF226 BI257 KH855 " +
  "CM237 CA1 CV238 KY1345 CF236 TD235 CL56 CN86 CO57 KM269 CG242 CD243 CK682 CR506 CI225 HR385 CU53 CW599 CY357 " +
  "CZ420 DK45 DJ253 DM1767 DO1809 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FK500 FO298 FJ679 FI358 FR33 " +
  "GF594 PF689 GA241 GM220 GE995 DE49 GH233 GI350 GR30 GL299 GD1473 GP590 GU1671 GT502 GG44 GN224 GW245 GY592 " +
  "HT509 HN504 HK852 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IM44 IL972 IT39 JM1876 JP81 JE44 JO962 KZ7 KE254 KI686 " +
  "XK383 KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ML223 " +
  "MT356 MH692 MQ596 MR222 MU230 YT262 MX52 FM691 MD373 MC377 MN976 ME382 MS1664 MA212 MZ258 MM95 NA264 NR674 " +
  "NP977 NL31 NC687 NZ64 NI505 NE227 NG234 NU683 KP850 MK389 MP1670 NO47 OM968 PK92 PW680 PS970 PA507 PG675 " +
  "PY595 PE51 PH63 PL48 PT351 PR1787 QA974 RE262 RO40 RU7 RW250 BL590 SH290 KN1869 LC1758 MF590 PM508 VC1784 " +
  "WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SX1721 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 " +
  "LK94 SD249 SR597 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TK690 TO676 TT1868 TN216 TR90 TM993 " +
  "TC1649 TV688 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VU678 VA39 VE58 VN84 VI1340 WF681 YE967 ZM260 ZW263";

export type CountryCode = { iso: string; dial: string };

export const countries: CountryCode[] = RAW.split(" ").map((entry) => ({
  iso: entry.slice(0, 2),
  dial: entry.slice(2),
}));

const byIso = new Map(countries.map((c) => [c.iso, c]));

export function findCountry(iso: string | undefined | null): CountryCode | undefined {
  return iso ? byIso.get(iso.toUpperCase()) : undefined;
}

/** Countries shown first in the list — the main markets. */
export const pinnedCountries = ["UA", "US", "GB", "DE", "PL", "NL", "CA"];

/** 🇺🇦 from "UA". */
export function flagEmoji(iso: string): string {
  return String.fromCodePoint(...[...iso.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

export function countryName(iso: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(iso) ?? iso;
  } catch {
    return iso;
  }
}

/**
 * Best guess for the visitor's country, used only to preselect the code:
 * browser language region (en-GB → GB), then the Kyiv time zone, then the site language.
 */
export function guessCountry(siteLocale: string): string {
  if (typeof navigator !== "undefined") {
    for (const tag of navigator.languages ?? [navigator.language]) {
      const region = tag?.split("-")[1];
      if (region && region.length === 2 && byIso.has(region.toUpperCase())) return region.toUpperCase();
    }
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Europe/Kiev" || tz === "Europe/Kyiv") return "UA";
    } catch {
      /* ignore */
    }
  }
  return siteLocale === "uk" ? "UA" : "US";
}

/**
 * Joins a country code and a national number into "+380 67 123 4567"; empty number → "".
 * If the visitor typed a full international number ("+49 30 …") it is kept as-is.
 */
export function formatPhone(dial: string, national: string): string {
  const number = national.trim().replace(/\s+/g, " ");
  if (!number) return "";
  if (number.startsWith("+")) {
    const match = number.match(/^\+(\d{1,4})[\s-]?(.*)$/);
    return match ? `+${match[1]} ${match[2].trim()}` : number;
  }
  if (number.startsWith("00")) return formatPhone(dial, `+${number.slice(2)}`);
  return `+${dial} ${number}`;
}

/** Digits only — for tel: and WhatsApp links. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}
