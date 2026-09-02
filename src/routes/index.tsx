import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Flame, Calendar } from "lucide-react";
import { getHome } from "@/lib/league/api";
import { MatchCard } from "@/components/league/match-card";
import { TeamBadge } from "@/components/league/team-badge";
import { LiveBadge } from "@/components/league/live-badge";
import { StandingsTable } from "@/components/league/standings-table";
import { Countdown } from "@/components/league/countdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Match } from "@/lib/league/types";

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "home"],
    queryFn: () => getHome(),
    initialData: initial,
    refetchInterval: (q) => (q.state.data?.liveMatches.length ? 5000 : 20_000),
  });

  const live = data.liveMatches[0];
  const next = data.upcoming[0];

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border/80">
        <div className="pitch-grid pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Season {data.meta.season} · Matchday {data.currentMatchday}
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              {data.meta.name}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">{data.meta.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/table">League table</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/fixtures">Fixtures</Link>
              </Button>
            </div>
          </div>

          <Card className="relative">
            <CardHeader>
              {live ? (
                <>
                  <div className="flex items-center justify-between">
                    <CardTitle>In play</CardTitle>
                    <LiveBadge />
                  </div>
                  <p className="text-sm text-muted-foreground">Matchday {live.matchday}</p>
                </>
              ) : (
                <>
                  <CardTitle>Next kickoff</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {next ? `Matchday ${next.matchday}` : "Season complete"}
                  </p>
                </>
              )}
            </CardHeader>
            <CardContent>
              {live ? (
                <div className="space-y-4">
                  <Scoreboard match={live} />
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/matches/$id" params={{ id: String(live.id) }}>
                      Match centre
                    </Link>
                  </Button>
                </div>
              ) : next ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <MiniTeam team={next.home} />
                    <span className="font-display text-sm text-muted-foreground">VS</span>
                    <MiniTeam team={next.away} align="right" />
                  </div>
                  <Countdown target={next.kickoffAt} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No remaining fixtures.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              Latest results
            </CardTitle>
            <Link to="/results" className="text-sm text-primary hover:underline">
              All results
            </Link>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {data.latestResults.map((m) => (
              <MatchCard key={m.id} match={m} compact />
            ))}
          </CardContent>
        </Card>

        <div className="grid min-w-0 gap-6">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-4 text-primary" />
                Top three
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StandingsTable rows={data.top3} compact />
              <Button asChild variant="ghost" className="mt-3 w-full">
                <Link to="/table">Full table</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="size-4 text-primary" />
                Top scorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topScorer ? (
                <Link
                  to="/scorers"
                  className="flex items-center gap-3 rounded-[var(--radius-sm)] p-1 hover:bg-accent"
                >
                  <TeamBadge team={data.topScorer.team} />
                  <div className="min-w-0">
                    <p className="font-medium">{data.topScorer.name}</p>
                    <p className="text-sm text-muted-foreground">{data.topScorer.team.name}</p>
                  </div>
                  <p className="ml-auto font-display text-3xl font-semibold tabular-nums">
                    {data.topScorer.goals}
                  </p>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">No goals recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="min-w-0 lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming fixtures</CardTitle>
            <Link to="/fixtures" className="text-sm text-primary hover:underline">
              All fixtures
            </Link>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.upcoming.map((m) => (
              <MatchCard key={m.id} match={m} compact />
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Scoreboard({ match }: { match: Match }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <MiniTeam team={match.home} />
      <div className="text-center">
        <p className="font-display text-4xl font-semibold tabular-nums text-live">
          {match.homeScore}
          <span className="mx-1 text-faint">–</span>
          {match.awayScore}
        </p>
      </div>
      <MiniTeam team={match.away} align="right" />
    </div>
  );
}

function MiniTeam({
  team,
  align,
}: {
  team: { name: string; shortName: string; primaryColor: string; secondaryColor: string };
  align?: "right";
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <TeamBadge team={team} size="md" />
      <p className="truncate text-sm font-medium">{team.name}</p>
    </div>
  );
}
