import { Link } from "@tanstack/react-router";
import { TeamBadge } from "@/components/league/team-badge";
import type { Standing } from "@/lib/league/types";
import { cn, signed } from "@/lib/utils";

export function StandingsTable({
  rows,
  compact,
}: {
  rows: Standing[];
  compact?: boolean;
}) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", !compact && "min-w-[640px]")}>
        <thead>
          <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-faint">
            <th className="px-3 py-2 font-medium">Pos</th>
            <th className="px-3 py-2 font-medium">Team</th>
            <th className="px-2 py-2 text-center font-medium">P</th>
            {!compact && (
              <>
                <th className="px-2 py-2 text-center font-medium">W</th>
                <th className="px-2 py-2 text-center font-medium">D</th>
                <th className="px-2 py-2 text-center font-medium">L</th>
                <th className="px-2 py-2 text-center font-medium">GF</th>
                <th className="px-2 py-2 text-center font-medium">GA</th>
              </>
            )}
            <th className="px-2 py-2 text-center font-medium">GD</th>
            <th className="px-3 py-2 text-center font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.team.id}
              className="border-t border-border/80 hover:bg-accent/60"
            >
              <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-[var(--radius-xs)] text-xs font-semibold",
                    row.position === 1 && "bg-primary text-primary-foreground",
                    row.position <= 3 && row.position !== 1 && "bg-muted text-foreground",
                  )}
                >
                  {row.position}
                </span>
              </td>
              <td className="sticky left-0 bg-card px-3 py-2.5">
                <Link
                  to="/teams/$slug"
                  params={{ slug: row.team.slug }}
                  className="flex items-center gap-2.5 font-medium hover:text-primary"
                >
                  <TeamBadge team={row.team} size="sm" />
                  <span className="truncate">{row.team.name}</span>
                </Link>
              </td>
              <td className="px-2 py-2.5 text-center tabular-nums">{row.played}</td>
              {!compact && (
                <>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.won}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.drawn}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.lost}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goalsFor}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">{row.goalsAgainst}</td>
                </>
              )}
              <td className="px-2 py-2.5 text-center tabular-nums text-muted-foreground">
                {signed(row.goalDifference)}
              </td>
              <td className="px-3 py-2.5 text-center font-display text-base font-semibold tabular-nums">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
