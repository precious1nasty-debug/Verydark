import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAbout } from "@/lib/league/api";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  loader: () => getAbout(),
  component: AboutPage,
});

function AboutPage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "about"],
    queryFn: () => getAbout(),
    initialData: initial,
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <PageHeader kicker={data.meta.name} title="About the league" />
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed text-muted-foreground">{data.meta.about}</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Competition format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{data.teamCount} clubs, single round-robin, nine matchdays.</p>
            <p>Home and away is not mirrored this season — each pairing is played once.</p>
            <p>Live matches update on this site as the score changes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How the table works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Win 3 points · Draw 1 point · Loss 0 points.</p>
            <p>Tie-breakers: goal difference, then goals scored, then club name.</p>
            <p>Only finished matches count toward the table. Live scores do not.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
