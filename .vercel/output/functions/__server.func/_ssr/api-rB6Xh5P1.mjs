import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { c as toIso, o as getSql, t as authMiddleware } from "./utils-D5lQuapZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-rB6Xh5P1.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MATCH_SELECT = `
  m.id, m.matchday, m.kickoff_at, m.venue, m.status, m.home_score, m.away_score,
  ht.id as home_id, ht.name as home_name, ht.short_name as home_short, ht.slug as home_slug,
  ht.primary_color as home_primary, ht.secondary_color as home_secondary,
  at.id as away_id, at.name as away_name, at.short_name as away_short, at.slug as away_slug,
  at.primary_color as away_primary, at.secondary_color as away_secondary
`;
function teamFrom(row) {
	return {
		id: row.id,
		name: row.name,
		shortName: row.short_name,
		slug: row.slug,
		primaryColor: row.primary_color,
		secondaryColor: row.secondary_color,
		coach: row.coach,
		founded: row.founded,
		stadium: row.stadium
	};
}
function refFrom(id, name, shortName, slug, primary, secondary) {
	return {
		id,
		name,
		shortName,
		slug,
		primaryColor: primary,
		secondaryColor: secondary
	};
}
function matchFrom(row) {
	return {
		id: row.id,
		matchday: row.matchday,
		kickoffAt: toIso(row.kickoff_at),
		venue: row.venue,
		status: row.status,
		homeScore: Number(row.home_score),
		awayScore: Number(row.away_score),
		home: refFrom(row.home_id, row.home_name, row.home_short, row.home_slug, row.home_primary, row.home_secondary),
		away: refFrom(row.away_id, row.away_name, row.away_short, row.away_slug, row.away_primary, row.away_secondary)
	};
}
async function fetchMatches(whereSql, params = []) {
	return (await (await getSql()).query(`select ${MATCH_SELECT}
     from matches m
     join teams ht on ht.id = m.home_team_id
     join teams at on at.id = m.away_team_id
     ${whereSql}`, params)).map(matchFrom);
}
async function computeStandings() {
	return (await (await getSql())`
    select
      t.id, t.name, t.short_name, t.slug, t.primary_color, t.secondary_color,
      coalesce(sum(g.played), 0)::int as played,
      coalesce(sum(g.won), 0)::int as won,
      coalesce(sum(g.drawn), 0)::int as drawn,
      coalesce(sum(g.lost), 0)::int as lost,
      coalesce(sum(g.gf), 0)::int as gf,
      coalesce(sum(g.ga), 0)::int as ga
    from teams t
    left join (
      select home_team_id as team_id, 1 as played, home_score as gf, away_score as ga,
        case when home_score > away_score then 1 else 0 end as won,
        case when home_score = away_score then 1 else 0 end as drawn,
        case when home_score < away_score then 1 else 0 end as lost
      from matches where status = 'finished'
      union all
      select away_team_id, 1, away_score, home_score,
        case when away_score > home_score then 1 else 0 end,
        case when away_score = home_score then 1 else 0 end,
        case when away_score < home_score then 1 else 0 end
      from matches where status = 'finished'
    ) g on g.team_id = t.id
    group by t.id, t.name, t.short_name, t.slug, t.primary_color, t.secondary_color
    order by (coalesce(sum(g.won),0)*3 + coalesce(sum(g.drawn),0)) desc,
             (coalesce(sum(g.gf),0) - coalesce(sum(g.ga),0)) desc,
             coalesce(sum(g.gf),0) desc,
             t.name asc
  `).map((row, i) => {
		const gf = Number(row.gf);
		const ga = Number(row.ga);
		const won = Number(row.won);
		const drawn = Number(row.drawn);
		return {
			position: i + 1,
			team: refFrom(row.id, row.name, row.short_name, row.slug, row.primary_color, row.secondary_color),
			played: Number(row.played),
			won,
			drawn,
			lost: Number(row.lost),
			goalsFor: gf,
			goalsAgainst: ga,
			goalDifference: gf - ga,
			points: won * 3 + drawn
		};
	});
}
async function fetchScorers() {
	return (await (await getSql())`
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
  `).map((r) => ({
		playerId: r.id,
		name: r.name,
		shirtNumber: Number(r.shirt_number),
		position: r.position,
		team: refFrom(r.team_id, r.team_name, r.short_name, r.slug, r.primary_color, r.secondary_color),
		goals: Number(r.goals),
		assists: Number(r.assists),
		yellows: Number(r.yellows),
		reds: Number(r.reds)
	}));
}
async function currentMatchday() {
	const rows = await (await getSql())`
    select coalesce(
      (select min(matchday) from matches where status = 'live'),
      (select min(matchday) from matches where status = 'upcoming'),
      (select max(matchday) from matches),
      1
    )::int as n
  `;
	return Number(rows[0]?.n ?? 1);
}
async function fetchMeta() {
	return (await (await getSql())`
    select name, season, tagline, about from league_meta where id = 1
  `)[0] ?? {
		name: "Dream League",
		season: "2026",
		tagline: "",
		about: ""
	};
}
var getHome_createServerFn_handler = createServerRpc({
	id: "773ed9f9e42a7ca554da5b9697c51819a0f167b7357accda217583acbd30a96f",
	name: "getHome",
	filename: "src/lib/league/api.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).handler(getHome_createServerFn_handler, async () => {
	const [meta, matchday, liveMatches, latestResults, upcoming, standings, scorers] = await Promise.all([
		fetchMeta(),
		currentMatchday(),
		fetchMatches(`where m.status = 'live' order by m.kickoff_at asc`),
		fetchMatches(`where m.status = 'finished' order by m.kickoff_at desc limit 6`),
		fetchMatches(`where m.status = 'upcoming' order by m.kickoff_at asc limit 6`),
		computeStandings(),
		fetchScorers()
	]);
	const topScorer = scorers.find((s) => s.goals > 0) ?? null;
	const nextKickoff = liveMatches[0]?.kickoffAt ?? upcoming[0]?.kickoffAt ?? null;
	return {
		meta,
		currentMatchday: matchday,
		liveMatches,
		latestResults,
		upcoming,
		top3: standings.slice(0, 3),
		topScorer,
		nextKickoff
	};
});
var getStandings_createServerFn_handler = createServerRpc({
	id: "3ab2abeef56eca16e2da7d78f8fc377846ebab1f4e29e82cf228a6cc3f8baa1d",
	name: "getStandings",
	filename: "src/lib/league/api.ts"
}, (opts) => getStandings.__executeServer(opts));
var getStandings = createServerFn({ method: "GET" }).handler(getStandings_createServerFn_handler, async () => {
	const [table, matchday, meta] = await Promise.all([
		computeStandings(),
		currentMatchday(),
		fetchMeta()
	]);
	return {
		table,
		currentMatchday: matchday,
		meta
	};
});
var getFixtures_createServerFn_handler = createServerRpc({
	id: "5206a404619e99b196f5f54b9752edf2bcfce49beff975cd48ffc977602e335a",
	name: "getFixtures",
	filename: "src/lib/league/api.ts"
}, (opts) => getFixtures.__executeServer(opts));
var getFixtures = createServerFn({ method: "GET" }).handler(getFixtures_createServerFn_handler, async () => {
	return { matches: await fetchMatches(`where m.status in ('upcoming', 'live') order by m.kickoff_at asc, m.id asc`) };
});
var getResults_createServerFn_handler = createServerRpc({
	id: "e5cb4e8b7c1b0ce16dbfb8e224037afca7ae5ea847ad9e23b678092a3471f882",
	name: "getResults",
	filename: "src/lib/league/api.ts"
}, (opts) => getResults.__executeServer(opts));
var getResults = createServerFn({ method: "GET" }).handler(getResults_createServerFn_handler, async () => {
	return { matches: await fetchMatches(`where m.status = 'finished' order by m.kickoff_at desc, m.id desc`) };
});
var getTopScorers_createServerFn_handler = createServerRpc({
	id: "34d5475e41cd7cd6a91117c2a1f5936863860183415e75beb9257b25c55ecf1b",
	name: "getTopScorers",
	filename: "src/lib/league/api.ts"
}, (opts) => getTopScorers.__executeServer(opts));
var getTopScorers = createServerFn({ method: "GET" }).handler(getTopScorers_createServerFn_handler, async () => {
	return { scorers: (await fetchScorers()).filter((s) => s.goals > 0) };
});
var getPlayerStats_createServerFn_handler = createServerRpc({
	id: "eb6bcfff34b2071bd3db229ed53cb91d2af678ff32f69a6cccad36fd5f2b0109",
	name: "getPlayerStats",
	filename: "src/lib/league/api.ts"
}, (opts) => getPlayerStats.__executeServer(opts));
var getPlayerStats = createServerFn({ method: "GET" }).handler(getPlayerStats_createServerFn_handler, async () => {
	return { stats: await fetchScorers() };
});
var getTeams_createServerFn_handler = createServerRpc({
	id: "4b4f29797ffbd0baa3f40874bf0a470ce61ca17503eab992142224d329177f7b",
	name: "getTeams",
	filename: "src/lib/league/api.ts"
}, (opts) => getTeams.__executeServer(opts));
var getTeams = createServerFn({ method: "GET" }).handler(getTeams_createServerFn_handler, async () => {
	return { teams: (await (await getSql())`
    select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium
    from teams order by name
  `).map(teamFrom) };
});
var getTeam_createServerFn_handler = createServerRpc({
	id: "ea0f89e29ff50db154ef09b7d2396cef3e7a2e6d22bdd46596deb6cd8fc6281f",
	name: "getTeam",
	filename: "src/lib/league/api.ts"
}, (opts) => getTeam.__executeServer(opts));
var getTeam = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getTeam_createServerFn_handler, async ({ data: slug }) => {
	const sql = await getSql();
	const team = (await sql`
      select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium
      from teams where slug = ${slug} limit 1
    `)[0];
	if (!team) return {
		team: null,
		players: [],
		matches: [],
		standing: null
	};
	const playerRows = await sql`
      select id, team_id, name, shirt_number, position
      from players where team_id = ${team.id}
      order by case position when 'GK' then 0 when 'DF' then 1 when 'MF' then 2 else 3 end, shirt_number
    `;
	const matches = await fetchMatches(`where m.home_team_id = $1 or m.away_team_id = $1 order by m.kickoff_at asc`, [team.id]);
	const standing = (await computeStandings()).find((s) => s.team.id === team.id) ?? null;
	return {
		team: teamFrom(team),
		players: playerRows.map((p) => ({
			id: p.id,
			teamId: p.team_id,
			name: p.name,
			shirtNumber: Number(p.shirt_number),
			position: p.position
		})),
		matches,
		standing
	};
});
var getMatch_createServerFn_handler = createServerRpc({
	id: "c052c2c5ea4dab00e29239e0abb7bf06920ff8c1a69be0386b9bfd047e7986fd",
	name: "getMatch",
	filename: "src/lib/league/api.ts"
}, (opts) => getMatch.__executeServer(opts));
var getMatch = createServerFn({ method: "GET" }).validator((id) => id).handler(getMatch_createServerFn_handler, async ({ data: id }) => {
	const match = (await fetchMatches(`where m.id = $1`, [id]))[0] ?? null;
	if (!match) return {
		match: null,
		events: []
	};
	return {
		match,
		events: (await (await getSql())`
      select e.id, e.match_id, e.team_id, e.player_id, e.assist_player_id, e.event_type, e.minute,
        p.name as player_name, a.name as assist_name
      from match_events e
      left join players p on p.id = e.player_id
      left join players a on a.id = e.assist_player_id
      where e.match_id = ${id}
      order by e.minute asc, e.id asc
    `).map((e) => ({
			id: e.id,
			matchId: e.match_id,
			teamId: e.team_id,
			playerId: e.player_id,
			playerName: e.player_name,
			assistPlayerId: e.assist_player_id,
			assistPlayerName: e.assist_name,
			eventType: e.event_type,
			minute: Number(e.minute)
		}))
	};
});
var getAnnouncements_createServerFn_handler = createServerRpc({
	id: "82d4d05a348b92804c3662004a8d9d65963ef725a12704d212e8fe9336637e07",
	name: "getAnnouncements",
	filename: "src/lib/league/api.ts"
}, (opts) => getAnnouncements.__executeServer(opts));
var getAnnouncements = createServerFn({ method: "GET" }).handler(getAnnouncements_createServerFn_handler, async () => {
	return { announcements: (await (await getSql())`
    select id, title, body, published_at from announcements order by published_at desc
  `).map((r) => ({
		id: r.id,
		title: r.title,
		body: r.body,
		publishedAt: toIso(r.published_at)
	})) };
});
var getAbout_createServerFn_handler = createServerRpc({
	id: "1f809f21a19a1ef14796c02165a31667ace5d7132c42abffcfdbe5a694ffd95f",
	name: "getAbout",
	filename: "src/lib/league/api.ts"
}, (opts) => getAbout.__executeServer(opts));
var getAbout = createServerFn({ method: "GET" }).handler(getAbout_createServerFn_handler, async () => {
	const [meta, standings] = await Promise.all([fetchMeta(), computeStandings()]);
	return {
		meta,
		teamCount: standings.length
	};
});
var getAllMatchesAdmin_createServerFn_handler = createServerRpc({
	id: "412836c1ab50de36968daafdd17be6945eadbe11e128ea9baa76ef273f40b34f",
	name: "getAllMatchesAdmin",
	filename: "src/lib/league/api.ts"
}, (opts) => getAllMatchesAdmin.__executeServer(opts));
var getAllMatchesAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAllMatchesAdmin_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context.userId);
	return {
		matches: await fetchMatches(`order by m.matchday asc, m.kickoff_at asc, m.id asc`),
		teams: (await (await getSql())`select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium from teams order by name`).map(teamFrom)
	};
});
var getAdminPlayers_createServerFn_handler = createServerRpc({
	id: "4fe2997d9c1102c89f3abe55c526f7bc97d09647952cd4ccda39b275be711abf",
	name: "getAdminPlayers",
	filename: "src/lib/league/api.ts"
}, (opts) => getAdminPlayers.__executeServer(opts));
var getAdminPlayers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminPlayers_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context.userId);
	const sql = await getSql();
	return {
		teams: (await sql`select id, name, short_name, slug, primary_color, secondary_color, coach, founded, stadium from teams order by name`).map(teamFrom),
		players: (await sql`select id, team_id, name, shirt_number, position from players order by team_id, shirt_number`).map((p) => ({
			id: p.id,
			teamId: p.team_id,
			name: p.name,
			shirtNumber: Number(p.shirt_number),
			position: p.position
		}))
	};
});
async function ensureAdmin(userId) {
	const sql = await getSql();
	const admins = await sql`select user_id from league_admins`;
	if (admins.length === 0) {
		await sql`insert into league_admins (user_id) values (${userId})`;
		return;
	}
	if (!admins.some((a) => a.user_id === userId)) throw new Error("Forbidden");
}
var getAdminSession_createServerFn_handler = createServerRpc({
	id: "653dcfaf40471b3030ded0536796883710c90050d2ffca0191c82830c0db2c59",
	name: "getAdminSession",
	filename: "src/lib/league/api.ts"
}, (opts) => getAdminSession.__executeServer(opts));
var getAdminSession = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminSession_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const admins = await sql`select user_id from league_admins`;
	const isFirst = admins.length === 0;
	const isAdmin = isFirst || admins.some((a) => a.user_id === context.userId);
	if (isFirst) await sql`insert into league_admins (user_id) values (${context.userId})`;
	const meta = await fetchMeta();
	return {
		userId: context.userId,
		isAdmin,
		claimed: isFirst,
		meta
	};
});
var updateMatchScore_createServerFn_handler = createServerRpc({
	id: "ae538f12169b7b40ce23bcb5bea8dfc5222e0718099ada45f1e1b9c3f4ba6e21",
	name: "updateMatchScore",
	filename: "src/lib/league/api.ts"
}, (opts) => updateMatchScore.__executeServer(opts));
var updateMatchScore = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateMatchScore_createServerFn_handler, async ({ context, data }) => {
	await ensureAdmin(context.userId);
	await (await getSql())`
      update matches
      set home_score = ${data.homeScore},
          away_score = ${data.awayScore},
          status = ${data.status},
          updated_at = now()
      where id = ${data.matchId}
    `;
	return { ok: true };
});
var saveMatch_createServerFn_handler = createServerRpc({
	id: "7b901051a8d67a9d0870f149f50db10a93fc62897405363b7cb70d4726b26f82",
	name: "saveMatch",
	filename: "src/lib/league/api.ts"
}, (opts) => saveMatch.__executeServer(opts));
var saveMatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveMatch_createServerFn_handler, async ({ context, data }) => {
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
	return { id: (await sql`
      insert into matches (matchday, home_team_id, away_team_id, kickoff_at, venue, status)
      values (${data.matchday}, ${data.homeTeamId}, ${data.awayTeamId}, ${data.kickoffAt}, ${data.venue}, ${data.status})
      returning id
    `)[0].id };
});
var deleteMatch_createServerFn_handler = createServerRpc({
	id: "fbdcc593d8fcd32a6a260d11ba6b81e101ae3e87cf7f1ea918dcde9522846594",
	name: "deleteMatch",
	filename: "src/lib/league/api.ts"
}, (opts) => deleteMatch.__executeServer(opts));
var deleteMatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteMatch_createServerFn_handler, async ({ context, data: id }) => {
	await ensureAdmin(context.userId);
	await (await getSql())`delete from matches where id = ${id}`;
	return { ok: true };
});
var addMatchEvent_createServerFn_handler = createServerRpc({
	id: "2b66e4b75b049c8726ce6ff37f82805d9f2ab5826789f45155d3db0d6f60a53d",
	name: "addMatchEvent",
	filename: "src/lib/league/api.ts"
}, (opts) => addMatchEvent.__executeServer(opts));
var addMatchEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addMatchEvent_createServerFn_handler, async ({ context, data }) => {
	await ensureAdmin(context.userId);
	const sql = await getSql();
	await sql`
      insert into match_events (match_id, team_id, player_id, assist_player_id, event_type, minute)
      values (${data.matchId}, ${data.teamId}, ${data.playerId}, ${data.assistPlayerId}, ${data.eventType}, ${data.minute})
    `;
	if (data.bumpScore && (data.eventType === "goal" || data.eventType === "own_goal")) {
		const match = (await sql`
        select home_team_id, away_team_id from matches where id = ${data.matchId}
      `)[0];
		if (match) {
			if (data.teamId === match.home_team_id) await sql`update matches set home_score = home_score + 1, updated_at = now() where id = ${data.matchId}`;
			else if (data.teamId === match.away_team_id) await sql`update matches set away_score = away_score + 1, updated_at = now() where id = ${data.matchId}`;
		}
	}
	return { ok: true };
});
var deleteMatchEvent_createServerFn_handler = createServerRpc({
	id: "f552f3212fa8805830231687c30d68a3b89a9a97128cb79d010019d441d2a63e",
	name: "deleteMatchEvent",
	filename: "src/lib/league/api.ts"
}, (opts) => deleteMatchEvent.__executeServer(opts));
var deleteMatchEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteMatchEvent_createServerFn_handler, async ({ context, data: id }) => {
	await ensureAdmin(context.userId);
	await (await getSql())`delete from match_events where id = ${id}`;
	return { ok: true };
});
var saveTeam_createServerFn_handler = createServerRpc({
	id: "bdfc3f3c4fd79af2979c8e9596425c24afc9e92f6b8576fae4ba292c89ec00bd",
	name: "saveTeam",
	filename: "src/lib/league/api.ts"
}, (opts) => saveTeam.__executeServer(opts));
var saveTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveTeam_createServerFn_handler, async ({ context, data }) => {
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
	return { id: (await sql`
      insert into teams (name, short_name, slug, primary_color, secondary_color, coach, founded, stadium)
      values (${data.name}, ${data.shortName}, ${data.slug}, ${data.primaryColor}, ${data.secondaryColor}, ${data.coach}, ${data.founded}, ${data.stadium})
      returning id
    `)[0].id };
});
var deleteTeam_createServerFn_handler = createServerRpc({
	id: "e4fd10969bdfbc80f5ecc01b16c68b62a6d7f4db1586c7f11faef2f99c206ba8",
	name: "deleteTeam",
	filename: "src/lib/league/api.ts"
}, (opts) => deleteTeam.__executeServer(opts));
var deleteTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteTeam_createServerFn_handler, async ({ context, data: id }) => {
	await ensureAdmin(context.userId);
	const sql = await getSql();
	const used = await sql`select count(*)::int as n from matches where home_team_id = ${id} or away_team_id = ${id}`;
	if (Number(used[0]?.n) > 0) throw new Error("Cannot delete a team that already has fixtures");
	await sql`delete from teams where id = ${id}`;
	return { ok: true };
});
var savePlayer_createServerFn_handler = createServerRpc({
	id: "6c6b11d1cef8491dc313d740fd1f3e631b910f936fe9ee20da2a2b8ff825c9b5",
	name: "savePlayer",
	filename: "src/lib/league/api.ts"
}, (opts) => savePlayer.__executeServer(opts));
var savePlayer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(savePlayer_createServerFn_handler, async ({ context, data }) => {
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
	return { id: (await sql`
      insert into players (team_id, name, shirt_number, position)
      values (${data.teamId}, ${data.name}, ${data.shirtNumber}, ${data.position})
      returning id
    `)[0].id };
});
var deletePlayer_createServerFn_handler = createServerRpc({
	id: "f89034b5c40f8fa51ba7d83f88e7b0ebc79e8ec3a85b19b825cfc32716f2d90a",
	name: "deletePlayer",
	filename: "src/lib/league/api.ts"
}, (opts) => deletePlayer.__executeServer(opts));
var deletePlayer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deletePlayer_createServerFn_handler, async ({ context, data: id }) => {
	await ensureAdmin(context.userId);
	await (await getSql())`delete from players where id = ${id}`;
	return { ok: true };
});
var saveAnnouncement_createServerFn_handler = createServerRpc({
	id: "fc76ec9efe4b385fdf45ac6682a5f00d916feea4abbe1664f95e3b0e19b56afd",
	name: "saveAnnouncement",
	filename: "src/lib/league/api.ts"
}, (opts) => saveAnnouncement.__executeServer(opts));
var saveAnnouncement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAnnouncement_createServerFn_handler, async ({ context, data }) => {
	await ensureAdmin(context.userId);
	const sql = await getSql();
	if (data.id) {
		await sql`update announcements set title = ${data.title}, body = ${data.body} where id = ${data.id}`;
		return { id: data.id };
	}
	return { id: (await sql`
      insert into announcements (title, body) values (${data.title}, ${data.body}) returning id
    `)[0].id };
});
var deleteAnnouncement_createServerFn_handler = createServerRpc({
	id: "babfa96ab51dd76dc093738ea58c77a4d5b05a981777c1d828fc592e3607bdfa",
	name: "deleteAnnouncement",
	filename: "src/lib/league/api.ts"
}, (opts) => deleteAnnouncement.__executeServer(opts));
var deleteAnnouncement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteAnnouncement_createServerFn_handler, async ({ context, data: id }) => {
	await ensureAdmin(context.userId);
	await (await getSql())`delete from announcements where id = ${id}`;
	return { ok: true };
});
var saveMeta_createServerFn_handler = createServerRpc({
	id: "5c253d4854137a86c8cd3540c512acb6c152c7fd0f2ffe6749ffe7aa443a9b5d",
	name: "saveMeta",
	filename: "src/lib/league/api.ts"
}, (opts) => saveMeta.__executeServer(opts));
var saveMeta = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveMeta_createServerFn_handler, async ({ context, data }) => {
	await ensureAdmin(context.userId);
	await (await getSql())`
      update league_meta set name = ${data.name}, season = ${data.season},
        tagline = ${data.tagline}, about = ${data.about}, updated_at = now()
      where id = 1
    `;
	return { ok: true };
});
//#endregion
export { addMatchEvent_createServerFn_handler, deleteAnnouncement_createServerFn_handler, deleteMatchEvent_createServerFn_handler, deleteMatch_createServerFn_handler, deletePlayer_createServerFn_handler, deleteTeam_createServerFn_handler, getAbout_createServerFn_handler, getAdminPlayers_createServerFn_handler, getAdminSession_createServerFn_handler, getAllMatchesAdmin_createServerFn_handler, getAnnouncements_createServerFn_handler, getFixtures_createServerFn_handler, getHome_createServerFn_handler, getMatch_createServerFn_handler, getPlayerStats_createServerFn_handler, getResults_createServerFn_handler, getStandings_createServerFn_handler, getTeam_createServerFn_handler, getTeams_createServerFn_handler, getTopScorers_createServerFn_handler, saveAnnouncement_createServerFn_handler, saveMatch_createServerFn_handler, saveMeta_createServerFn_handler, savePlayer_createServerFn_handler, saveTeam_createServerFn_handler, updateMatchScore_createServerFn_handler };
