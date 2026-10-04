"use client";

import { useEffect, useMemo, useState } from "react";
import { countries, countryName, findCountry, flagEmoji, guessCountry, pinnedCountries } from "@/lib/contact/countries";

type PhoneInputProps = {
  id: string;
  locale: string;
  countryLabel: string;
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
  inputClassName: string;
};

/**
 * International phone field: country code selector + national number.
 * Submits `phoneCountry` (ISO code) and `phoneNumber`; the server joins them.
 * The selector is a native <select> (accessible, works on mobile) visually
 * replaced by a compact "🇺🇦 +380" button.
 */
export function PhoneInput({ id, locale, countryLabel, placeholder, invalid, describedBy, inputClassName }: PhoneInputProps) {
  const [iso, setIso] = useState(locale === "uk" ? "UA" : "US");
  const [touched, setTouched] = useState(false);

  // Preselect the visitor's likely country after hydration (unless they already chose one).
  useEffect(() => {
    if (!touched) setIso(guessCountry(locale));
  }, [locale, touched]);

  const options = useMemo(() => {
    const named = countries.map((c) => ({ ...c, name: countryName(c.iso, locale) }));
    const collator = new Intl.Collator(locale);
    const pinned = pinnedCountries.map((code) => named.find((c) => c.iso === code)!).filter(Boolean);
    const rest = named.filter((c) => !pinnedCountries.includes(c.iso)).sort((a, b) => collator.compare(a.name, b.name));
    return { pinned, rest };
  }, [locale]);

  const selected = findCountry(iso) ?? countries[0];

  return (
    <div className="flex gap-2">
      <div className="relative shrink-0 rounded-xl has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent has-[:focus-visible]:outline">
        <span
          aria-hidden="true"
          className={`pointer-events-none flex h-full items-center gap-1.5 rounded-xl border bg-bg/70 py-3 pl-3 pr-7 text-fg ${
            invalid ? "border-red-400/60" : "border-line"
          }`}
        >
          <span className="text-base leading-none">{flagEmoji(selected.iso)}</span>
          <span className="font-mono text-sm tabular-nums">+{selected.dial}</span>
          <svg viewBox="0 0 12 12" className="absolute right-2.5 size-3 text-subtle" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 4.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <select
          name="phoneCountry"
          aria-label={countryLabel}
          value={iso}
          onChange={(e) => {
            setTouched(true);
            setIso(e.target.value);
          }}
          className="absolute inset-0 w-full cursor-pointer rounded-xl opacity-0"
        >
          <optgroup label="—">
            {options.pinned.map((c) => (
              <option key={`p-${c.iso}`} value={c.iso} suppressHydrationWarning>
                {flagEmoji(c.iso)} {c.name} (+{c.dial})
              </option>
            ))}
          </optgroup>
          <optgroup label="A–Z">
            {options.rest.map((c) => (
              <option key={c.iso} value={c.iso} suppressHydrationWarning>
                {flagEmoji(c.iso)} {c.name} (+{c.dial})
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <input
        id={id}
        name="phoneNumber"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        maxLength={24}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`min-w-0 flex-1 ${inputClassName}`}
      />
    </div>
  );
}
