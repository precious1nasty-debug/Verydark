import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFixtures } from "@/lib/league/api";
import { MatchCard } from "@/components/league/match-card";
import { PageHeader } from "@/components/layout/page-header";
import type { Match } from "@/lib/league/types";

export const Route = createFileRoute("/fixtures")({
  loader: () => getFixtures(),
  component: FixturesPage,
});

function FixturesPage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "fixtures"],
    queryFn: () => getFixtures(),
    initialData: initial,
    refetchInterval: (q) => (q.state.data?.matches.some((m) => m.status === "live") ? 5000 : 20_000),
  });

  const groups = groupByMatchday(data.matches);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageHeader
        kicker="Calendar"
        title="Fixtures"
        description="Upcoming and live matches. Kickoff times shown in your local timezone."
      />
      {groups.length === 0 ? (
        <p className="text-muted-foreground">No remaining fixtures.</p>
      ) : (
        <div className="space-y-10">
          {groups.map(([md, list]) => (
            <section key={md}>
              <h2 className="mb-4 font-display text-xl">Matchday {md}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {list.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function groupByMatchday(matches: Match[]) {
  const map = new Map<number, Match[]>();
  for (const m of matches) {
    const list = map.get(m.matchday) ?? [];
    list.push(m);
    map.set(m.matchday, list);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
