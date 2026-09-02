import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStandings } from "@/lib/league/api";
import { StandingsTable } from "@/components/league/standings-table";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/table")({
  loader: () => getStandings(),
  component: TablePage,
});

function TablePage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "standings"],
    queryFn: () => getStandings(),
    initialData: initial,
    refetchInterval: 15_000,
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageHeader
        kicker={`Season ${data.meta.season} · Matchday ${data.currentMatchday}`}
        title="League table"
        description="Three points for a win, one for a draw. Ranked by points, then goal difference, then goals scored."
      />
      <Card className="min-w-0 overflow-hidden">
        <CardContent className="px-2 py-3 sm:px-4">
          <StandingsTable rows={data.table} />
        </CardContent>
      </Card>
    </main>
  );
}
