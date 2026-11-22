import { useEffect, useState } from "react";
import { getDeadline, type CampaignMode } from "@/config/campaign";

export function CampaignCountdown({ mode, tone = "forest" }: { mode: CampaignMode; tone?: "forest" | "wine" }) {
  const deadline = getDeadline(mode);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!deadline || now === null) return null;

  const diff = Math.max(0, deadline.getTime() - now);
  const parts = [
    [Math.floor(diff / 864e5), "jours"],
    [Math.floor(diff / 36e5) % 24, "h"],
    [Math.floor(diff / 6e4) % 60, "min"],
    [Math.floor(diff / 1e3) % 60, "s"],
  ] as const;
  const date = deadline.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  });

  return (
    <div className="text-center">
      <p className="mb-3 text-sm font-semibold opacity-85">
        {mode === "blackfriday" ? "Black Friday Week · jusqu'au" : "Offre de Noël · jusqu'au"} {date}
      </p>
      <div className="flex justify-center gap-2">
        {parts.map(([value, label]) => (
          <div key={label} className={`min-w-16 rounded-xl border border-gold/25 px-3 py-2 text-secondary-foreground ${tone === "wine" ? "bg-wine-deep" : "bg-forest-deep"}`}>
            <div className="font-display text-2xl font-extrabold tabular-nums">{String(value).padStart(2, "0")}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
