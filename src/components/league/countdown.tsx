import { useEffect, useState } from "react";

export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  if (diff === 0) {
    return <p className="font-display text-lg tracking-wide text-primary">Kickoff</p>;
  }

  return (
    <div className="flex gap-3">
      <Unit value={days} label="Days" />
      <Unit value={hours} label="Hrs" />
      <Unit value={minutes} label="Min" />
      <Unit value={seconds} label="Sec" />
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-14 rounded-[var(--radius-sm)] bg-muted px-2 py-2 text-center">
      <div className="font-display text-2xl font-semibold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-faint">{label}</div>
    </div>
  );
}
