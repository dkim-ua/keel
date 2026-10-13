"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/dictionaries";
import { roleIds, type RoleId } from "@/content/roles";
import { CheckIcon } from "./ui/Icons";

export function TeamModel({ t }: { t: Dictionary["team"] }) {
  const [presetId, setPresetId] = useState(t.presets[0].id);
  const preset = t.presets.find((p) => p.id === presetId) ?? t.presets[0];
  const active = new Set<RoleId>(preset.roles);

  return (
    <section id="team" aria-labelledby="team-title" className="relative border-t border-line py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div data-reveal>
          <p className="eyebrow mb-5">{t.eyebrow}</p>
          <h2 id="team-title" className="text-h2 font-semibold">
            {t.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{t.text}</p>

          <div className="mt-10 border-l border-accent/60 pl-5">
            <p className="text-lg font-medium text-fg">{t.note}</p>
            <p className="mt-2 leading-relaxed text-muted">{t.noteText}</p>
          </div>
          <p className="mt-8 text-sm text-subtle">{t.lead}</p>
        </div>

        <div className="card p-2 sm:p-3" data-reveal>
          <div className="px-3 pb-3 pt-2 sm:px-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-subtle" id="team-presets-label">
              {t.examplesLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby="team-presets-label">
              {t.presets.map((p) => {
                const selected = p.id === preset.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPresetId(p.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      selected ? "border-accent/60 bg-accent/10 text-fg" : "border-line text-muted hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="overflow-hidden rounded-xl border border-line bg-bg/70" aria-live="polite">
            {roleIds.map((role) => {
              const on = active.has(role);
              return (
                <li
                  key={role}
                  className={`flex items-center justify-between gap-4 border-b border-line px-4 py-3.5 transition-[opacity,background-color] duration-500 last:border-b-0 sm:px-5 ${
                    on ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex size-6 items-center justify-center rounded-md border transition-colors duration-500 ${
                        on ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      <CheckIcon className="size-3.5" />
                    </span>
                    <span className={on ? "text-fg" : "text-muted line-through decoration-line-strong"}>{t.roles[role]}</span>
                  </span>
                  <span className="sr-only">{on ? t.inTeam : t.notNeeded}</span>
                  <span aria-hidden="true" className="font-mono text-[0.68rem] uppercase tracking-wider text-subtle">
                    {on ? "●" : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="px-3 pb-2 pt-3 text-xs text-subtle sm:px-4">{t.illustrative}</p>
        </div>
      </div>
    </section>
  );
}
