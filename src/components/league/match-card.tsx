import { Link } from "@tanstack/react-router";
import { TeamBadge } from "@/components/league/team-badge";
import { LiveBadge } from "@/components/league/live-badge";
import { Badge } from "@/components/ui/badge";
import type { Match } from "@/lib/league/types";
import { cn, formatKickoff } from "@/lib/utils";

export function MatchCard({ match, compact }: { match: Match; compact?: boolean }) {
  const { date, time } = formatKickoff(match.kickoffAt);
  const finished = match.status === "finished";
  const live = match.status === "live";

  return (
    <Link
      to="/matches/$id"
      params={{ id: String(match.id) }}
      className={cn(
        "block rounded-[var(--radius-md)] bg-card p-4 shadow-[var(--shadow-card)] hairline transition-[transform,background-color] duration-150 hover:bg-accent",
        compact && "p-3",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          MD {match.matchday}
          <span className="mx-1.5 text-faint">/</span>
          {date} · {time}
        </span>
        {live ? (
          <LiveBadge />
        ) : finished ? (
          <Badge variant="outline">Full time</Badge>
        ) : (
          <Badge variant="muted">Upcoming</Badge>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamLine team={match.home} align="right" />
        <Score match={match} />
        <TeamLine team={match.away} align="left" />
      </div>
      {match.venue ? (
        <p className="mt-3 text-center text-xs text-faint">{match.venue}</p>
      ) : null}
    </Link>
  );
}

function TeamLine({
  team,
  align,
}: {
  team: Match["home"];
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        align === "right" ? "flex-row-reverse text-right" : "flex-row",
      )}
    >
      <TeamBadge team={team} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          <span className="sm:hidden">{team.shortName}</span>
          <span className="hidden sm:inline">{team.name}</span>
        </p>
        <p className="hidden text-[11px] uppercase tracking-wider text-faint sm:block">
          {team.shortName}
        </p>
      </div>
    </div>
  );
}

function Score({ match }: { match: Match }) {
  if (match.status === "upcoming") {
    return (
      <div className="min-w-14 text-center font-display text-sm uppercase tracking-wider text-muted-foreground">
        vs
      </div>
    );
  }
  return (
    <div
      className={cn(
        "min-w-16 text-center font-display text-2xl font-semibold tabular-nums leading-none",
        match.status === "live" && "text-live",
      )}
    >
      {match.homeScore}
      <span className="mx-1 text-faint">–</span>
      {match.awayScore}
    </div>
  );
}
