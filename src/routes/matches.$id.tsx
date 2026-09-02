import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMatch } from "@/lib/league/api";
import { TeamBadge } from "@/components/league/team-badge";
import { LiveBadge } from "@/components/league/live-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKickoff } from "@/lib/utils";
import type { MatchEvent } from "@/lib/league/types";

export const Route = createFileRoute("/matches/$id")({
  loader: ({ params }) => getMatch({ data: Number(params.id) }),
  component: MatchPage,
});

function MatchPage() {
  const { id } = Route.useParams();
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "match", id],
    queryFn: () => getMatch({ data: Number(id) }),
    initialData: initial,
    refetchInterval: (q) => (q.state.data?.match?.status === "live" ? 4000 : false),
  });

  if (!data.match) {
    return (
      <main className="mx-auto max-w-6xl flex-1 px-4 py-16">
        <p className="text-muted-foreground">Match not found.</p>
      </main>
    );
  }

  const m = data.match;
  const { date, time } = formatKickoff(m.kickoffAt);
  const goals = data.events.filter((e) => e.eventType === "goal" || e.eventType === "own_goal");
  const cards = data.events.filter((e) => e.eventType === "yellow" || e.eventType === "red");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <p className="mb-4 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Matchday {m.matchday} · {date} · {time}
      </p>
      <div className="mb-3 flex justify-center">
        {m.status === "live" ? (
          <LiveBadge />
        ) : m.status === "finished" ? (
          <Badge variant="outline">Full time</Badge>
        ) : (
          <Badge variant="muted">Upcoming</Badge>
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Club team={m.home} />
        <div className="text-center">
          {m.status === "upcoming" ? (
            <p className="font-display text-2xl text-muted-foreground">VS</p>
          ) : (
            <p
              className={`font-display text-5xl font-semibold tabular-nums ${m.status === "live" ? "text-live" : ""}`}
            >
              {m.homeScore}
              <span className="mx-1 text-faint">–</span>
              {m.awayScore}
            </p>
          )}
        </div>
        <Club team={m.away} />
      </div>
      <p className="mt-4 text-center text-sm text-faint">{m.venue}</p>

      <div className="mt-10 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Goal scorers</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No goals recorded.</p>
            ) : (
              <ul className="space-y-2">
                {goals.map((e) => (
                  <EventRow key={e.id} event={e} homeId={m.home.id} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {cards.length === 0 ? (
              <p className="text-sm text-muted-foreground">No cards recorded.</p>
            ) : (
              <ul className="space-y-2">
                {cards.map((e) => (
                  <EventRow key={e.id} event={e} homeId={m.home.id} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Club({ team }: { team: { name: string; slug: string; shortName: string; primaryColor: string; secondaryColor: string } }) {
  return (
    <Link to="/teams/$slug" params={{ slug: team.slug }} className="flex flex-col items-center gap-2 text-center">
      <TeamBadge team={team} size="lg" />
      <span className="text-sm font-medium">{team.name}</span>
    </Link>
  );
}

function EventRow({ event, homeId }: { event: MatchEvent; homeId: number }) {
  const label =
    event.eventType === "goal"
      ? "Goal"
      : event.eventType === "own_goal"
        ? "Own goal"
        : event.eventType === "yellow"
          ? "Yellow"
          : "Red";
  const home = event.teamId === homeId;
  return (
    <li className={`flex items-center gap-3 text-sm ${home ? "" : "flex-row-reverse text-right"}`}>
      <span className="w-10 tabular-nums text-muted-foreground">{event.minute}'</span>
      <span className="min-w-0">
        <span className="font-medium">{event.playerName ?? "Unknown"}</span>
        {event.assistPlayerName ? (
          <span className="block text-xs text-muted-foreground">Assist {event.assistPlayerName}</span>
        ) : null}
      </span>
      <span className="text-[11px] uppercase tracking-wider text-faint">{label}</span>
    </li>
  );
}
