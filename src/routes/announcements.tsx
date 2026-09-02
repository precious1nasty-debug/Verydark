import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "@/lib/league/api";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKickoff } from "@/lib/utils";

export const Route = createFileRoute("/announcements")({
  loader: () => getAnnouncements(),
  component: NewsPage,
});

function NewsPage() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["league", "announcements"],
    queryFn: () => getAnnouncements(),
    initialData: initial,
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <PageHeader
        kicker="Bulletin"
        title="Announcements"
        description="Official notes from the Dream League office."
      />
      <div className="space-y-4">
        {data.announcements.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <p className="text-xs uppercase tracking-wider text-faint">
                {formatKickoff(a.publishedAt).full}
              </p>
              <CardTitle>{a.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
