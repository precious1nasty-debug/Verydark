import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTopScorers } from "@/lib/league/api";
import { TeamBadge } from "@/components/league/team-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/scorers")({
  loader: () => getTopScorers(),
  component: ScorersPage,
});

function ScorersPage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "scorers"],
    queryFn: () => getTopScorers(),
    initialData: initial,
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageHeader
        kicker="Golden boot"
        title="Top scorers"
        description="League goals only. Own goals are not credited to the scorer."
      />
      <Card>
        <CardContent className="overflow-x-auto px-0 py-2">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-faint">
                <th className="px-5 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Player</th>
                <th className="px-3 py-2 font-medium">Club</th>
                <th className="px-3 py-2 text-center font-medium">G</th>
                <th className="px-5 py-2 text-center font-medium">A</th>
              </tr>
            </thead>
            <tbody>
              {data.scorers.map((s, i) => (
                <tr key={s.playerId} className="border-t border-border/80">
                  <td className="px-5 py-3 tabular-nums text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-3">
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-2 text-xs text-faint">#{s.shirtNumber}</span>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to="/teams/$slug"
                      params={{ slug: s.team.slug }}
                      className="inline-flex items-center gap-2 hover:text-primary"
                    >
                      <TeamBadge team={s.team} size="sm" />
                      {s.team.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-center font-display text-lg font-semibold tabular-nums">
                    {s.goals}
                  </td>
                  <td className="px-5 py-3 text-center tabular-nums text-muted-foreground">
                    {s.assists}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
