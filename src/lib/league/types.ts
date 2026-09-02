export type MatchStatus = "upcoming" | "live" | "finished";
export type Position = "GK" | "DF" | "MF" | "FW";
export type EventType = "goal" | "own_goal" | "yellow" | "red";

export type Team = {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  coach: string;
  founded: string;
  stadium: string;
};

export type TeamRef = Pick<
  Team,
  "id" | "name" | "shortName" | "slug" | "primaryColor" | "secondaryColor"
>;

export type Player = {
  id: number;
  teamId: number;
  name: string;
  shirtNumber: number;
  position: Position;
};

export type Match = {
  id: number;
  matchday: number;
  kickoffAt: string;
  venue: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  home: TeamRef;
  away: TeamRef;
};

export type MatchEvent = {
  id: number;
  matchId: number;
  teamId: number;
  playerId: number | null;
  playerName: string | null;
  assistPlayerId: number | null;
  assistPlayerName: string | null;
  eventType: EventType;
  minute: number;
};

export type Standing = {
  position: number;
  team: TeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type Scorer = {
  playerId: number;
  name: string;
  shirtNumber: number;
  position: Position;
  team: TeamRef;
  goals: number;
  assists: number;
};

export type PlayerStat = Scorer & {
  yellows: number;
  reds: number;
};

export type Announcement = {
  id: number;
  title: string;
  body: string;
  publishedAt: string;
};

export type LeagueMeta = {
  name: string;
  season: string;
  tagline: string;
  about: string;
};

export type HomePayload = {
  meta: LeagueMeta;
  currentMatchday: number;
  liveMatches: Match[];
  latestResults: Match[];
  upcoming: Match[];
  top3: Standing[];
  topScorer: Scorer | null;
  nextKickoff: string | null;
};
