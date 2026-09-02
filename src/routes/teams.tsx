import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/lib/league/api";
import { TeamBadge } from "@/components/league/team-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/teams")({
  loader: () => getTeams(),
  component: TeamsPage,
});

function TeamsPage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "teams"],
    queryFn: () => getTeams(),
    initialData: initial,
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageHeader
        kicker="Clubs"
        title="Teams"
        description="Ten sides contesting the 2026 Dream League championship."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.teams.map((team) => (
          <Link key={team.id} to="/teams/$slug" params={{ slug: team.slug }}>
            <Card className="h-full transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 pt-6">
                <TeamBadge team={team} size="lg" />
                <div className="min-w-0">
                  <p className="font-display text-xl">{team.name}</p>
                  <p className="text-sm text-muted-foreground">{team.stadium}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-faint">
                    Est. {team.founded}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
