import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  addMatchEvent,
  deleteAnnouncement,
  deleteMatch,
  deleteMatchEvent,
  deletePlayer,
  deleteTeam,
  getAdminPlayers,
  getAdminSession,
  getAllMatchesAdmin,
  getAnnouncements,
  getMatch,
  saveAnnouncement,
  saveMatch,
  saveMeta,
  savePlayer,
  saveTeam,
  updateMatchScore,
} from "@/lib/league/api";
import type {
  EventType,
  Match,
  MatchStatus,
  Player,
  Position,
  Team,
} from "@/lib/league/types";
import { TeamBadge } from "@/components/league/team-badge";
import { LiveBadge } from "@/components/league/live-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatKickoff } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const session = useQuery({
    queryKey: ["admin", "session"],
    queryFn: () => getAdminSession(),
    enabled: Boolean(user),
    retry: false,
  });

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="h-10 w-48 animate-pulse rounded-[var(--radius-sm)] bg-muted" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (session.isPending) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="h-10 w-48 animate-pulse rounded-[var(--radius-sm)] bg-muted" />
      </main>
    );
  }
  if (session.error || session.data?.isAdmin === false) {
    return (
      <main className="mx-auto max-w-lg flex-1 px-4 py-16 text-center">
        <h1 className="font-display text-3xl">No admin access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          An administrator is already registered for this league. Sign in with that account
          to manage the competition.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to the league</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Office</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">Admin dashboard</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        Changes save to the database and show on the public site immediately.
      </p>
      <Tabs defaultValue="matches">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="league">League</TabsTrigger>
        </TabsList>
        <TabsContent value="matches">
          <MatchesAdmin />
        </TabsContent>
        <TabsContent value="teams">
          <TeamsAdmin />
        </TabsContent>
        <TabsContent value="players">
          <PlayersAdmin />
        </TabsContent>
        <TabsContent value="news">
          <NewsAdmin />
        </TabsContent>
        <TabsContent value="league">
          <LeagueAdmin
            initial={session.data!.meta}
            onSaved={() => session.refetch()}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

function MatchesAdmin() {
  const invalidate = useInvalidate();
  const { data } = useQuery({
    queryKey: ["admin", "matches"],
    queryFn: () => getAllMatchesAdmin(),
  });
  const [open, setOpen] = useState(false);
  const [eventsFor, setEventsFor] = useState<Match | null>(null);

  const scoreMut = useMutation({
    mutationFn: updateMatchScore,
    onSuccess: () => {
      toast.success("Match updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => deleteMatch({ data: id }),
    onSuccess: () => {
      toast.success("Fixture removed");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!data) return <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>Add fixture</Button>
      </div>
      <div className="space-y-3">
        {data.matches.map((m) => (
          <Card key={m.id}>
            <CardContent className="space-y-3 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  MD {m.matchday} · {formatKickoff(m.kickoffAt).full} · {m.venue}
                </p>
                {m.status === "live" ? (
                  <LiveBadge />
                ) : m.status === "finished" ? (
                  <Badge variant="outline">Finished</Badge>
                ) : (
                  <Badge variant="muted">Upcoming</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <TeamBadge team={m.home} size="sm" />
                  <span className="truncate text-sm font-medium">{m.home.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  <ScoreBtn
                    value={m.homeScore}
                    onChange={(homeScore) =>
                      scoreMut.mutate({
                        data: {
                          matchId: m.id,
                          homeScore,
                          awayScore: m.awayScore,
                          status: m.status === "upcoming" ? "live" : m.status,
                        },
                      })
                    }
                  />
                  <span className="text-muted-foreground">–</span>
                  <ScoreBtn
                    value={m.awayScore}
                    onChange={(awayScore) =>
                      scoreMut.mutate({
                        data: {
                          matchId: m.id,
                          homeScore: m.homeScore,
                          awayScore,
                          status: m.status === "upcoming" ? "live" : m.status,
                        },
                      })
                    }
                  />
                </div>
                <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
                  <span className="truncate text-sm font-medium">{m.away.name}</span>
                  <TeamBadge team={m.away} size="sm" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["upcoming", "live", "finished"] as MatchStatus[]).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={m.status === status ? "default" : "outline"}
                    onClick={() =>
                      scoreMut.mutate({
                        data: {
                          matchId: m.id,
                          homeScore: m.homeScore,
                          awayScore: m.awayScore,
                          status,
                        },
                      })
                    }
                  >
                    {status === "upcoming" ? "Upcoming" : status === "live" ? "Live" : "Finished"}
                  </Button>
                ))}
                <Button size="sm" variant="secondary" onClick={() => setEventsFor(m)}>
                  Events
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm("Delete this fixture?")) delMut.mutate(m.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Add fixture">
          <MatchForm
            teams={data.teams}
            onDone={() => {
              setOpen(false);
              invalidate();
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(eventsFor)} onOpenChange={(v) => !v && setEventsFor(null)}>
        {eventsFor ? (
          <DialogContent title="Match events">
            <EventsForm match={eventsFor} onChanged={invalidate} />
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function ScoreBtn({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="size-9"
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        –
      </Button>
      <span className="w-8 text-center font-display text-xl tabular-nums">{value}</span>
      <Button type="button" size="icon" variant="outline" className="size-9" onClick={() => onChange(value + 1)}>
        +
      </Button>
    </div>
  );
}

function MatchForm({ teams, onDone }: { teams: Team[]; onDone: () => void }) {
  const [homeTeamId, setHomeTeamId] = useState(teams[0]?.id ?? 0);
  const [awayTeamId, setAwayTeamId] = useState(teams[1]?.id ?? 0);
  const [matchday, setMatchday] = useState(1);
  const [kickoffAt, setKickoffAt] = useState("");
  const [venue, setVenue] = useState(teams[0]?.stadium ?? "");
  const mut = useMutation({
    mutationFn: saveMatch,
    onSuccess: () => {
      toast.success("Fixture saved");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate({
          data: {
            matchday,
            homeTeamId,
            awayTeamId,
            kickoffAt: new Date(kickoffAt).toISOString(),
            venue,
            status: "upcoming",
          },
        });
      }}
    >
      <Field label="Matchday">
        <Input
          type="number"
          min={1}
          value={matchday}
          onChange={(e) => setMatchday(Number(e.target.value))}
          required
        />
      </Field>
      <Field label="Home">
        <select
          className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
          value={homeTeamId}
          onChange={(e) => {
            const id = Number(e.target.value);
            setHomeTeamId(id);
            const t = teams.find((x) => x.id === id);
            if (t) setVenue(t.stadium);
          }}
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Away">
        <select
          className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
          value={awayTeamId}
          onChange={(e) => setAwayTeamId(Number(e.target.value))}
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Kickoff">
        <Input
          type="datetime-local"
          value={kickoffAt}
          onChange={(e) => setKickoffAt(e.target.value)}
          required
        />
      </Field>
      <Field label="Venue">
        <Input value={venue} onChange={(e) => setVenue(e.target.value)} required />
      </Field>
      <Button type="submit" className="w-full" disabled={mut.isPending}>
        Save fixture
      </Button>
    </form>
  );
}

function EventsForm({
  match,
  onChanged,
}: {
  match: Match;
  onChanged: () => void;
}) {
  const playersQ = useQuery({
    queryKey: ["admin", "players"],
    queryFn: () => getAdminPlayers(),
  });
  const detail = useQuery({
    queryKey: ["league", "match", String(match.id)],
    queryFn: () => getMatch({ data: match.id }),
  });
  const [teamId, setTeamId] = useState(match.home.id);
  const [playerId, setPlayerId] = useState<number | "">("");
  const [assistId, setAssistId] = useState<number | "">("");
  const [eventType, setEventType] = useState<EventType>("goal");
  const [minute, setMinute] = useState(1);
  const addMut = useMutation({
    mutationFn: addMatchEvent,
    onSuccess: () => {
      toast.success("Event added");
      detail.refetch();
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: number) => deleteMatchEvent({ data: id }),
    onSuccess: () => {
      toast.success("Event removed");
      detail.refetch();
      onChanged();
    },
  });
  const players = (playersQ.data?.players ?? []).filter((p) => p.teamId === teamId);

  return (
    <div className="space-y-4">
      <ul className="space-y-2 text-sm">
        {(detail.data?.events ?? []).map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-2">
            <span>
              {e.minute}' {e.eventType} · {e.playerName ?? "—"}
              {e.assistPlayerName ? ` (A ${e.assistPlayerName})` : ""}
            </span>
            <Button size="sm" variant="ghost" onClick={() => delMut.mutate(e.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          addMut.mutate({
            data: {
              matchId: match.id,
              teamId,
              playerId: playerId === "" ? null : Number(playerId),
              assistPlayerId: assistId === "" ? null : Number(assistId),
              eventType,
              minute,
              bumpScore: eventType === "goal" || eventType === "own_goal",
            },
          });
        }}
      >
        <Field label="Club">
          <select
            className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
            value={teamId}
            onChange={(e) => {
              setTeamId(Number(e.target.value));
              setPlayerId("");
              setAssistId("");
            }}
          >
            {[match.home, match.away].map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Type">
          <select
            className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
          >
            <option value="goal">Goal</option>
            <option value="own_goal">Own goal</option>
            <option value="yellow">Yellow card</option>
            <option value="red">Red card</option>
          </select>
        </Field>
        <Field label="Player">
          <select
            className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Select</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} #{p.shirtNumber}
              </option>
            ))}
          </select>
        </Field>
        {eventType === "goal" ? (
          <Field label="Assist">
            <select
              className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
              value={assistId}
              onChange={(e) => setAssistId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">None</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        <Field label="Minute">
          <Input
            type="number"
            min={1}
            max={120}
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={addMut.isPending}>
          Add event
        </Button>
        <p className="text-xs text-faint">Goals increment the live score automatically.</p>
      </form>
    </div>
  );
}

function TeamsAdmin() {
  const invalidate = useInvalidate();
  const { data } = useQuery({
    queryKey: ["admin", "matches"],
    queryFn: () => getAllMatchesAdmin(),
  });
  const [editing, setEditing] = useState<Team | null>(null);
  const [creating, setCreating] = useState(false);
  const delMut = useMutation({
    mutationFn: (id: number) => deleteTeam({ data: id }),
    onSuccess: () => {
      toast.success("Team removed");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  if (!data) return <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" />;
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>Add team</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.teams.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex items-center gap-3 pt-5">
              <TeamBadge team={t} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.stadium}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setEditing(t)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  if (confirm("Delete this team?")) delMut.mutate(t.id);
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={creating || Boolean(editing)} onOpenChange={(v) => { if (!v) { setCreating(false); setEditing(null); } }}>
        <DialogContent title={editing ? "Edit team" : "Add team"}>
          <TeamForm
            initial={editing}
            onDone={() => {
              setCreating(false);
              setEditing(null);
              invalidate();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamForm({ initial, onDone }: { initial: Team | null; onDone: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [shortName, setShortName] = useState(initial?.shortName ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [primaryColor, setPrimaryColor] = useState(initial?.primaryColor ?? "#1B4B5A");
  const [secondaryColor, setSecondaryColor] = useState(initial?.secondaryColor ?? "#E8EEE9");
  const [coach, setCoach] = useState(initial?.coach ?? "");
  const [founded, setFounded] = useState(initial?.founded ?? "");
  const [stadium, setStadium] = useState(initial?.stadium ?? "");
  const mut = useMutation({
    mutationFn: saveTeam,
    onSuccess: () => {
      toast.success("Team saved");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate({
          data: {
            id: initial?.id,
            name,
            shortName,
            slug,
            primaryColor,
            secondaryColor,
            coach,
            founded,
            stadium,
          },
        });
      }}
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Short">
          <Input value={shortName} onChange={(e) => setShortName(e.target.value)} required />
        </Field>
        <Field label="Slug">
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary">
          <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
        </Field>
        <Field label="Secondary">
          <Input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
        </Field>
      </div>
      <Field label="Coach">
        <Input value={coach} onChange={(e) => setCoach(e.target.value)} />
      </Field>
      <Field label="Founded">
        <Input value={founded} onChange={(e) => setFounded(e.target.value)} />
      </Field>
      <Field label="Stadium">
        <Input value={stadium} onChange={(e) => setStadium(e.target.value)} />
      </Field>
      <Button type="submit" className="w-full" disabled={mut.isPending}>
        Save team
      </Button>
    </form>
  );
}

function PlayersAdmin() {
  const invalidate = useInvalidate();
  const { data } = useQuery({
    queryKey: ["admin", "players"],
    queryFn: () => getAdminPlayers(),
  });
  const [teamFilter, setTeamFilter] = useState<number | "all">("all");
  const [editing, setEditing] = useState<Player | null>(null);
  const [creating, setCreating] = useState(false);
  const delMut = useMutation({
    mutationFn: (id: number) => deletePlayer({ data: id }),
    onSuccess: () => {
      toast.success("Player removed");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const list = useMemo(() => {
    if (!data) return [];
    if (teamFilter === "all") return data.players;
    return data.players.filter((p) => p.teamId === teamFilter);
  }, [data, teamFilter]);
  if (!data) return <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="h-11 rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">All clubs</option>
          {data.teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Button className="ml-auto" onClick={() => setCreating(true)}>
          Add player
        </Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto px-0 py-2">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-faint">
                <th className="px-4 py-2">Player</th>
                <th className="px-2 py-2">No</th>
                <th className="px-2 py-2">Pos</th>
                <th className="px-2 py-2">Club</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const team = data.teams.find((t) => t.id === p.teamId);
                return (
                  <tr key={p.id} className="border-t border-border/80">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-2 py-2 tabular-nums">{p.shirtNumber}</td>
                    <td className="px-2 py-2">{p.position}</td>
                    <td className="px-2 py-2">{team?.shortName}</td>
                    <td className="px-4 py-2 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => delMut.mutate(p.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Dialog open={creating || Boolean(editing)} onOpenChange={(v) => { if (!v) { setCreating(false); setEditing(null); } }}>
        <DialogContent title={editing ? "Edit player" : "Add player"}>
          <PlayerForm
            teams={data.teams}
            initial={editing}
            defaultTeamId={teamFilter === "all" ? data.teams[0]?.id : teamFilter}
            onDone={() => {
              setCreating(false);
              setEditing(null);
              invalidate();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlayerForm({
  teams,
  initial,
  defaultTeamId,
  onDone,
}: {
  teams: Team[];
  initial: Player | null;
  defaultTeamId?: number;
  onDone: () => void;
}) {
  const [teamId, setTeamId] = useState(initial?.teamId ?? defaultTeamId ?? teams[0]?.id ?? 0);
  const [name, setName] = useState(initial?.name ?? "");
  const [shirtNumber, setShirtNumber] = useState(initial?.shirtNumber ?? 99);
  const [position, setPosition] = useState<Position>(initial?.position ?? "MF");
  const mut = useMutation({
    mutationFn: savePlayer,
    onSuccess: () => {
      toast.success("Player saved");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        mut.mutate({ data: { id: initial?.id, teamId, name, shirtNumber, position } });
      }}
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Club">
        <select
          className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
          value={teamId}
          onChange={(e) => setTeamId(Number(e.target.value))}
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Number">
          <Input
            type="number"
            min={1}
            max={99}
            value={shirtNumber}
            onChange={(e) => setShirtNumber(Number(e.target.value))}
          />
        </Field>
        <Field label="Position">
          <select
            className="h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm"
            value={position}
            onChange={(e) => setPosition(e.target.value as Position)}
          >
            <option value="GK">GK</option>
            <option value="DF">DF</option>
            <option value="MF">MF</option>
            <option value="FW">FW</option>
          </select>
        </Field>
      </div>
      <Button type="submit" className="w-full" disabled={mut.isPending}>
        Save player
      </Button>
    </form>
  );
}

function NewsAdmin() {
  const invalidate = useInvalidate();
  const { data } = useQuery({
    queryKey: ["league", "announcements"],
    queryFn: () => getAnnouncements(),
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const mut = useMutation({
    mutationFn: saveAnnouncement,
    onSuccess: () => {
      toast.success("Announcement saved");
      setTitle("");
      setBody("");
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: number) => deleteAnnouncement({ data: id }),
    onSuccess: () => {
      toast.success("Removed");
      invalidate();
    },
  });
  if (!data) return <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" />;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit announcement" : "Post announcement"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              mut.mutate({ data: { id: editingId ?? undefined, title, body } });
            }}
          >
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>
            <Field label="Body">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
            </Field>
            <Button type="submit" disabled={mut.isPending}>
              {editingId ? "Update" : "Publish"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {data.announcements.map((a) => (
          <Card key={a.id}>
            <CardContent className="pt-5">
              <p className="font-medium">{a.title}</p>
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{a.body}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(a.id);
                    setTitle(a.title);
                    setBody(a.body);
                  }}
                >
                  Edit
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => delMut.mutate(a.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeagueAdmin({
  initial,
  onSaved,
}: {
  initial: { name: string; season: string; tagline: string; about: string };
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [season, setSeason] = useState(initial.season);
  const [tagline, setTagline] = useState(initial.tagline);
  const [about, setAbout] = useState(initial.about);
  const mut = useMutation({
    mutationFn: saveMeta,
    onSuccess: () => {
      toast.success("League details saved");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Card>
      <CardContent className="pt-6">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate({ data: { name, season, tagline, about } });
          }}
        >
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Season">
            <Input value={season} onChange={(e) => setSeason(e.target.value)} required />
          </Field>
          <Field label="Tagline">
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="About">
            <Textarea value={about} onChange={(e) => setAbout(e.target.value)} />
          </Field>
          <Button type="submit" disabled={mut.isPending}>
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
