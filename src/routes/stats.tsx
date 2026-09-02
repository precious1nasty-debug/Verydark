import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlayerStats } from "@/lib/league/api";
import { TeamBadge } from "@/components/league/team-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/stats")({
  loader: () => getPlayerStats(),
  component: StatsPage,
});

function StatsPage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "stats"],
    queryFn: () => getPlayerStats(),
    initialData: initial,
  });
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data.stats;
    return data.stats.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.team.name.toLowerCase().includes(term) ||
        s.position.toLowerCase() === term,
    );
  }, [data.stats, q]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageHeader
        kicker="Squads"
        title="Player statistics"
        description="Goals, assists, yellow and red cards across the season."
      />
      <div className="mb-4 max-w-sm">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search player, club or position"
          aria-label="Search players"
        />
      </div>
      <Card>
        <CardContent className="overflow-x-auto px-0 py-2">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-faint">
                <th className="px-5 py-2 font-medium">Player</th>
                <th className="px-3 py-2 font-medium">Pos</th>
                <th className="px-3 py-2 font-medium">Club</th>
                <th className="px-2 py-2 text-center font-medium">G</th>
                <th className="px-2 py-2 text-center font-medium">A</th>
                <th className="px-2 py-2 text-center font-medium">YC</th>
                <th className="px-5 py-2 text-center font-medium">RC</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.playerId} className="border-t border-border/80">
                  <td className="px-5 py-3">
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-2 text-xs text-faint">#{s.shirtNumber}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{s.position}</td>
                  <td className="px-3 py-3">
                    <Link
                      to="/teams/$slug"
                      params={{ slug: s.team.slug }}
                      className="inline-flex items-center gap-2 hover:text-primary"
                    >
                      <TeamBadge team={s.team} size="sm" />
                      {s.team.shortName}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-center tabular-nums">{s.goals}</td>
                  <td className="px-2 py-3 text-center tabular-nums">{s.assists}</td>
                  <td className="px-2 py-3 text-center tabular-nums text-muted-foreground">
                    {s.yellows}
                  </td>
                  <td className="px-5 py-3 text-center tabular-nums text-live">{s.reds || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
