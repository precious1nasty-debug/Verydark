import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTeam } from "@/lib/league/api";
import { TeamBadge } from "@/components/league/team-badge";
import { MatchCard } from "@/components/league/match-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signed } from "@/lib/utils";

export const Route = createFileRoute("/teams/$slug")({
  loader: ({ params }) => getTeam({ data: params.slug }),
  component: TeamPage,
});

function TeamPage() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "team", slug],
    queryFn: () => getTeam({ data: slug }),
    initialData: initial,
  });

  if (!data.team) {
    return (
      <main className="mx-auto max-w-6xl flex-1 px-4 py-16">
        <p className="text-muted-foreground">Club not found.</p>
        <Link to="/teams" className="mt-3 inline-block text-primary hover:underline">
          Back to teams
        </Link>
      </main>
    );
  }

  const { team, players, matches, standing } = data;
  const positions = ["GK", "DF", "MF", "FW"] as const;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <TeamBadge team={team} size="lg" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {team.shortName}
          </p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{team.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {team.stadium} · Coach {team.coach} · Founded {team.founded}
          </p>
        </div>
        {standing ? (
          <div className="ml-auto grid grid-cols-3 gap-3 text-center">
            <Stat label="Pos" value={String(standing.position)} />
            <Stat label="Pts" value={String(standing.points)} />
            <Stat label="GD" value={signed(standing.goalDifference)} />
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Squad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {positions.map((pos) => {
              const group = players.filter((p) => p.position === pos);
              if (!group.length) return null;
              return (
                <div key={pos}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
                    {pos}
                  </p>
                  <ul className="space-y-1.5">
                    {group.map((p) => (
                      <li key={p.id} className="flex items-center justify-between text-sm">
                        <span>{p.name}</span>
                        <span className="tabular-nums text-muted-foreground">#{p.shirtNumber}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="font-display text-xl">Fixtures & results</h2>
          <div className="grid gap-3">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-16 rounded-[var(--radius-sm)] bg-muted px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-faint">{label}</div>
      <div className="font-display text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
