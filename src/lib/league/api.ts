import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { toIso } from "@/lib/utils";
import type {
  Announcement,
  EventType,
  HomePayload,
  LeagueMeta,
  Match,
  MatchEvent,
  MatchStatus,
  Player,
  PlayerStat,
  Position,
  Scorer,
  Standing,
  Team,
  TeamRef,
} from "./types";

type TeamRow = {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  primary_color: string;
  secondary_color: string;
  coach: string;
  founded: string;
  stadium: string;
};

type MatchJoinRow = {
  id: number;
  matchday: number;
  kickoff_at: unknown;
  venue: string;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  home_id: number;
  home_name: string;
  home_short: string;
  home_slug: string;
  home_primary: string;
  home_secondary: string;
  away_id: number;
  away_name: string;
  away_short: string;
  away_slug: string;
  away_primary: string;
  away_secondary: string;
};

const MATCH_SELECT = `
  m.id, m.matchday, m.kickoff_at, m.venue, m.status, m.home_score, m.away_score,
  ht.id as home_id, ht.name as home_name, ht.short_name as home_short, ht.slug as home_slug,
  ht.primary_color as home_primary, ht.secondary_color as home_secondary,
  at.id as away_id, at.name as away_name, at.short_name as away_short, at.slug as away_slug,
  at.primary_color as away_primary, at.secondary_color as away_secondary
`;

function teamFrom(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    slug: row.slug,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    coach: row.coach,
    founded: row.founded,
    stadium: row.stadium,
  };
}

function refFrom(
  id: number,
  name: string,
  shortName: string,
  slug: string,
  primary: string,
  secondary: string,
): TeamRef {
  return { id, name, shortName, slug, primaryColor: primary, secondaryColor: secondary };
}

function matchFrom(row: MatchJoinRow): Match {
  return {
    id: row.id,
    matchday: row.matchday,
    kickoffAt: toIso(row.kickoff_at),
    venue: row.venue,
    status: row.status,
    homeScore: Number(row.home_score),
    awayScore: Number(row.away_score),
    home: refFrom(
      row.home_id,
      row.home_name,
      row.home_short,
      row.home_slug,
      row.home_primary,
      row.home_secondary,
    ),
    away: refFrom(
      row.away_id,
      row.away_name,
      row.away_short,
      row.away_slug,
      row.away_primary,
      row.away_secondary,
    ),
  };
}

async function fetchMatches(whereSql: string, params: unknown[] = []): Promise<Match[]> {
  const sql = await getSql();
  const rows = await sql.query<MatchJoinRow>(
    `select ${MATCH_SELECT}
     from matches m
     join teams ht on ht.id = m.home_team_id
     join teams at on at.id = m.away_team_id
     ${whereSql}`,
    params,
  );
  return rows.map(matchFrom);
}

async function computeStandings(): Promise<Standing[]> {
  const sql = await getSql();
  const teamRows = await sql<TeamRow>`
    select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium
    from teams
  `;
  const results = await sql<{
    home_team_id: number;
    away_team_id: number;
    home_score: number;
    away_score: number;
  }>`
    select home_team_id, away_team_id, home_score, away_score
    from matches
    where status = 'finished'
  `;

  const stats = new Map<
    number,
    { played: number; won: number; drawn: number; lost: number; gf: number; ga: number }
  >();
  for (const team of teamRows) {
    stats.set(team.id, { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0 });
  }
  for (const match of results) {
    const home = stats.get(match.home_team_id);
    const away = stats.get(match.away_team_id);
    if (!home || !away) continue;
    const hs = Number(match.home_score);
    const as = Number(match.away_score);
    home.played += 1;
    away.played += 1;
    home.gf += hs;
    home.ga += as;
    away.gf += as;
    away.ga += hs;
    if (hs > as) {
      home.won += 1;
      away.lost += 1;
    } else if (hs < as) {
      away.won += 1;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
    }
  }

  const standings: Standing[] = teamRows.map((row) => {
    const s = stats.get(row.id)!;
    return {
      position: 0,
      team: refFrom(row.id, row.name, row.short_name, row.slug, row.primary_color, row.secondary_color),
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goalsFor: s.gf,
      goalsAgainst: s.ga,
      goalDifference: s.gf - s.ga,
      points: s.won * 3 + s.drawn,
    };
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
  return standings.map((row, i) => ({ ...row, position: i + 1 }));
}

async function fetchScorers(): Promise<PlayerStat[]> {
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    name: string;
    shirt_number: number;
    position: Position;
    team_id: number;
    team_name: string;
    short_name: string;
    slug: string;
    primary_color: string;
    secondary_color: string;
    goals: number;
    assists: number;
    yellows: number;
    reds: number;
  }>`
    select
      p.id, p.name, p.shirt_number, p.position,
      t.id as team_id, t.name as team_name, t.short_name, t.slug, t.primary_color, t.secondary_color,
      coalesce(s.goals, 0)::int as goals,
      coalesce(a.assists, 0)::int as assists,
      coalesce(s.yellows, 0)::int as yellows,
      coalesce(s.reds, 0)::int as reds
    from players p
    join teams t on t.id = p.team_id
    left join (
      select player_id,
        count(*) filter (where event_type = 'goal')::int as goals,
        count(*) filter (where event_type = 'yellow')::int as yellows,
        count(*) filter (where event_type = 'red')::int as reds
      from match_events
      where player_id is not null
      group by player_id
    ) s on s.player_id = p.id
    left join (
      select assist_player_id as player_id, count(*)::int as assists
      from match_events
      where assist_player_id is not null and event_type = 'goal'
      group by assist_player_id
    ) a on a.player_id = p.id
    order by coalesce(s.goals, 0) desc, coalesce(a.assists, 0) desc, p.name asc
  `;
  return rows.map((r) => ({
    playerId: r.id,
    name: r.name,
    shirtNumber: Number(r.shirt_number),
    position: r.position,
    team: refFrom(r.team_id, r.team_name, r.short_name, r.slug, r.primary_color, r.secondary_color),
    goals: Number(r.goals),
    assists: Number(r.assists),
    yellows: Number(r.yellows),
    reds: Number(r.reds),
  }));
}

async function currentMatchday(): Promise<number> {
  const sql = await getSql();
  const rows = await sql<{ n: number | null }>`
    select coalesce(
      (select min(matchday) from matches where status = 'live'),
      (select min(matchday) from matches where status = 'upcoming'),
      (select max(matchday) from matches),
      1
    )::int as n
  `;
  return Number(rows[0]?.n ?? 1);
}

async function fetchMeta(): Promise<LeagueMeta> {
  const sql = await getSql();
  const rows = await sql<{ name: string; season: string; tagline: string; about: string }>`
    select name, season, tagline, about from league_meta where id = 1
  `;
  return (
    rows[0] ?? {
      name: "Dream League",
      season: "2026",
      tagline: "",
      about: "",
    }
  );
}

export const getHome = createServerFn({ method: "GET" }).handler(async (): Promise<HomePayload> => {
  const [meta, matchday, liveMatches, latestResults, upcoming, standings, scorers] =
    await Promise.all([
      fetchMeta(),
      currentMatchday(),
      fetchMatches(`where m.status = 'live' order by m.kickoff_at asc`),
      fetchMatches(`where m.status = 'finished' order by m.kickoff_at desc limit 6`),
      fetchMatches(`where m.status = 'upcoming' order by m.kickoff_at asc limit 6`),
      computeStandings(),
      fetchScorers(),
    ]);
  const topScorer: Scorer | null = scorers.find((s) => s.goals > 0) ?? null;
  const nextKickoff =
    liveMatches[0]?.kickoffAt ?? upcoming[0]?.kickoffAt ?? null;
  return {
    meta,
    currentMatchday: matchday,
    liveMatches,
    latestResults,
    upcoming,
    top3: standings.slice(0, 3),
    topScorer,
    nextKickoff,
  };
});

export const getStandings = createServerFn({ method: "GET" }).handler(async () => {
  const [table, matchday, meta] = await Promise.all([
    computeStandings(),
    currentMatchday(),
    fetchMeta(),
  ]);
  return { table, currentMatchday: matchday, meta };
});

export const getFixtures = createServerFn({ method: "GET" }).handler(async () => {
  const matches = await fetchMatches(
    `where m.status in ('upcoming', 'live') order by m.kickoff_at asc, m.id asc`,
  );
  return { matches };
});

export const getResults = createServerFn({ method: "GET" }).handler(async () => {
  const matches = await fetchMatches(
    `where m.status = 'finished' order by m.kickoff_at desc, m.id desc`,
  );
  return { matches };
});

export const getTopScorers = createServerFn({ method: "GET" }).handler(async () => {
  const scorers = (await fetchScorers()).filter((s) => s.goals > 0);
  return { scorers };
});

export const getPlayerStats = createServerFn({ method: "GET" }).handler(async () => {
  const stats = await fetchScorers();
  return { stats };
});

export const getTeams = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<TeamRow>`
    select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium
    from teams order by name
  `;
  return { teams: rows.map(teamFrom) };
});

export const getTeam = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const teams = await sql<TeamRow>`
      select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium
      from teams where slug = ${slug} limit 1
    `;
    const team = teams[0];
    if (!team) return { team: null as Team | null, players: [] as Player[], matches: [] as Match[], standing: null as Standing | null };
    const playerRows = await sql<{
      id: number;
      team_id: number;
      name: string;
      shirt_number: number;
      position: Position;
    }>`
      select id, team_id, name, shirt_number, position
      from players where team_id = ${team.id}
      order by case position when 'GK' then 0 when 'DF' then 1 when 'MF' then 2 else 3 end, shirt_number
    `;
    const matches = await fetchMatches(
      `where m.home_team_id = $1 or m.away_team_id = $1 order by m.kickoff_at asc`,
      [team.id],
    );
    const standings = await computeStandings();
    const standing = standings.find((s) => s.team.id === team.id) ?? null;
    return {
      team: teamFrom(team),
      players: playerRows.map((p) => ({
        id: p.id,
        teamId: p.team_id,
        name: p.name,
        shirtNumber: Number(p.shirt_number),
        position: p.position,
      })),
      matches,
      standing,
    };
  });

export const getMatch = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const matches = await fetchMatches(`where m.id = $1`, [id]);
    const match = matches[0] ?? null;
    if (!match) return { match: null as Match | null, events: [] as MatchEvent[] };
    const sql = await getSql();
    const eventRows = await sql<{
      id: number;
      match_id: number;
      team_id: number;
      player_id: number | null;
      assist_player_id: number | null;
      event_type: EventType;
      minute: number;
      player_name: string | null;
      assist_name: string | null;
    }>`
      select e.id, e.match_id, e.team_id, e.player_id, e.assist_player_id, e.event_type, e.minute,
        p.name as player_name, a.name as assist_name
      from match_events e
      left join players p on p.id = e.player_id
      left join players a on a.id = e.assist_player_id
      where e.match_id = ${id}
      order by e.minute asc, e.id asc
    `;
    const events: MatchEvent[] = eventRows.map((e) => ({
      id: e.id,
      matchId: e.match_id,
      teamId: e.team_id,
      playerId: e.player_id,
      playerName: e.player_name,
      assistPlayerId: e.assist_player_id,
      assistPlayerName: e.assist_name,
      eventType: e.event_type,
      minute: Number(e.minute),
    }));
    return { match, events };
  });

export const getAnnouncements = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ id: number; title: string; body: string; published_at: unknown }>`
    select id, title, body, published_at from announcements order by published_at desc
  `;
  const announcements: Announcement[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    publishedAt: toIso(r.published_at),
  }));
  return { announcements };
});

export const getAbout = createServerFn({ method: "GET" }).handler(async () => {
  const [meta, standings] = await Promise.all([fetchMeta(), computeStandings()]);
  return { meta, teamCount: standings.length };
});

export const getAllMatchesAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);
    const matches = await fetchMatches(`order by m.matchday asc, m.kickoff_at asc, m.id asc`);
    const sql = await getSql();
    const teams = (await sql<TeamRow>`select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium from teams order by name`).map(teamFrom);
    return { matches, teams };
  });

export const getAdminPlayers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    const teams = (await sql<TeamRow>`select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium from teams order by name`).map(teamFrom);
    const players = await sql<{
      id: number;
      team_id: number;
      name: string;
      shirt_number: number;
      position: Position;
    }>`select id, team_id, name, shirt_number, position from players order by team_id, shirt_number`;
    return {
      teams,
      players: players.map((p) => ({
        id: p.id,
        teamId: p.team_id,
        name: p.name,
        shirtNumber: Number(p.shirt_number),
        position: p.position,
      })),
    };
  });

async function ensureAdmin(userId: string) {
  const sql = await getSql();
  const admins = await sql<{ user_id: string }>`select user_id from league_admins`;
  if (admins.length === 0) {
    await sql`insert into league_admins (user_id) values (${userId})`;
    return;
  }
  if (!admins.some((a) => a.user_id === userId)) {
    throw new Error("Forbidden");
  }
}

export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const admins = await sql<{ user_id: string }>`select user_id from league_admins`;
    const isFirst = admins.length === 0;
    const isAdmin = isFirst || admins.some((a) => a.user_id === context.userId);
    if (isFirst) {
      await sql`insert into league_admins (user_id) values (${context.userId})`;
    }
    const meta = await fetchMeta();
    return { userId: context.userId, isAdmin, claimed: isFirst, meta };
  });

type ScoreInput = {
  matchId: number;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
};

export const updateMatchScore = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ScoreInput) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`
      update matches
      set home_score = ${data.homeScore},
          away_score = ${data.awayScore},
          status = ${data.status},
          updated_at = now()
      where id = ${data.matchId}
    `;
    return { ok: true };
  });

type MatchInput = {
  id?: number;
  matchday: number;
  homeTeamId: number;
  awayTeamId: number;
  kickoffAt: string;
  venue: string;
  status: MatchStatus;
};

export const saveMatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: MatchInput) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    if (data.homeTeamId === data.awayTeamId) throw new Error("Teams must be different");
    const sql = await getSql();
    if (data.id) {
      await sql`
        update matches set
          matchday = ${data.matchday},
          home_team_id = ${data.homeTeamId},
          away_team_id = ${data.awayTeamId},
          kickoff_at = ${data.kickoffAt},
          venue = ${data.venue},
          status = ${data.status},
          updated_at = now()
        where id = ${data.id}
      `;
      return { id: data.id };
    }
    const rows = await sql<{ id: number }>`
      insert into matches (matchday, home_team_id, away_team_id, kickoff_at, venue, status)
      values (${data.matchday}, ${data.homeTeamId}, ${data.awayTeamId}, ${data.kickoffAt}, ${data.venue}, ${data.status})
      returning id
    `;
    return { id: rows[0].id };
  });

export const deleteMatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from matches where id = ${id}`;
    return { ok: true };
  });

type EventInput = {
  matchId: number;
  teamId: number;
  playerId: number | null;
  assistPlayerId: number | null;
  eventType: EventType;
  minute: number;
  bumpScore?: boolean;
};

export const addMatchEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: EventInput) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`
      insert into match_events (match_id, team_id, player_id, assist_player_id, event_type, minute)
      values (${data.matchId}, ${data.teamId}, ${data.playerId}, ${data.assistPlayerId}, ${data.eventType}, ${data.minute})
    `;
    if (data.bumpScore && (data.eventType === "goal" || data.eventType === "own_goal")) {
      const m = await sql<{ home_team_id: number; away_team_id: number }>`
        select home_team_id, away_team_id from matches where id = ${data.matchId}
      `;
      const match = m[0];
      if (match) {
        if (data.teamId === match.home_team_id) {
          await sql`update matches set home_score = home_score + 1, updated_at = now() where id = ${data.matchId}`;
        } else if (data.teamId === match.away_team_id) {
          await sql`update matches set away_score = away_score + 1, updated_at = now() where id = ${data.matchId}`;
        }
      }
    }
    return { ok: true };
  });

export const deleteMatchEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from match_events where id = ${id}`;
    return { ok: true };
  });

type TeamInput = {
  id?: number;
  name: string;
  shortName: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  coach: string;
  founded: string;
  stadium: string;
};

export const saveTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: TeamInput) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`
        update teams set
          name = ${data.name}, short_name = ${data.shortName}, slug = ${data.slug},
          primary_color = ${data.primaryColor}, secondary_color = ${data.secondaryColor},
          coach = ${data.coach}, founded = ${data.founded}, stadium = ${data.stadium}
        where id = ${data.id}
      `;
      return { id: data.id };
    }
    const rows = await sql<{ id: number }>`
      insert into teams (name, short_name, slug, primary_color, secondary_color, coach, founded, stadium)
      values (${data.name}, ${data.shortName}, ${data.slug}, ${data.primaryColor}, ${data.secondaryColor}, ${data.coach}, ${data.founded}, ${data.stadium})
      returning id
    `;
    return { id: rows[0].id };
  });

export const deleteTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    const used = await sql<{ n: number }>`select count(*)::int as n from matches where home_team_id = ${id} or away_team_id = ${id}`;
    if (Number(used[0]?.n) > 0) throw new Error("Cannot delete a team that already has fixtures");
    await sql`delete from teams where id = ${id}`;
    return { ok: true };
  });

type PlayerInput = {
  id?: number;
  teamId: number;
  name: string;
  shirtNumber: number;
  position: Position;
};

export const savePlayer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: PlayerInput) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`
        update players set team_id = ${data.teamId}, name = ${data.name},
          shirt_number = ${data.shirtNumber}, position = ${data.position}
        where id = ${data.id}
      `;
      return { id: data.id };
    }
    const rows = await sql<{ id: number }>`
      insert into players (team_id, name, shirt_number, position)
      values (${data.teamId}, ${data.name}, ${data.shirtNumber}, ${data.position})
      returning id
    `;
    return { id: rows[0].id };
  });

export const deletePlayer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from players where id = ${id}`;
    return { ok: true };
  });

type AnnouncementInput = { id?: number; title: string; body: string };

export const saveAnnouncement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: AnnouncementInput) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    if (data.id) {
      await sql`update announcements set title = ${data.title}, body = ${data.body} where id = ${data.id}`;
      return { id: data.id };
    }
    const rows = await sql<{ id: number }>`
      insert into announcements (title, body) values (${data.title}, ${data.body}) returning id
    `;
    return { id: rows[0].id };
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from announcements where id = ${id}`;
    return { ok: true };
  });

export const saveMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: LeagueMeta) => input)
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const sql = await getSql();
    await sql`
      update league_meta set name = ${data.name}, season = ${data.season},
        tagline = ${data.tagline}, about = ${data.about}, updated_at = now()
      where id = 1
    `;
    return { ok: true };
  });
