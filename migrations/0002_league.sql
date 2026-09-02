-- Dream League schema

create table if not exists league_meta (
  id          integer primary key default 1 check (id = 1),
  name        text not null,
  season      text not null,
  tagline     text not null default '',
  about       text not null default '',
  updated_at  timestamptz not null default now()
);

create table if not exists league_admins (
  user_id     text primary key,
  created_at  timestamptz not null default now()
);

create table if not exists teams (
  id              serial primary key,
  name            text not null,
  short_name      text not null,
  slug            text not null unique,
  primary_color   text not null,
  secondary_color text not null,
  coach           text not null default '',
  founded         text not null default '',
  stadium         text not null default '',
  created_at      timestamptz not null default now()
);

create table if not exists players (
  id          serial primary key,
  team_id     integer not null references teams(id) on delete cascade,
  name        text not null,
  shirt_number integer not null,
  position    text not null check (position in ('GK', 'DF', 'MF', 'FW')),
  created_at  timestamptz not null default now(),
  unique (team_id, shirt_number)
);

create table if not exists matches (
  id            serial primary key,
  matchday      integer not null,
  home_team_id  integer not null references teams(id),
  away_team_id  integer not null references teams(id),
  kickoff_at    timestamptz not null,
  venue         text not null default '',
  status        text not null default 'upcoming' check (status in ('upcoming', 'live', 'finished')),
  home_score    integer not null default 0,
  away_score    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (home_team_id <> away_team_id),
  check (home_score >= 0 and away_score >= 0)
);

create table if not exists match_events (
  id                serial primary key,
  match_id          integer not null references matches(id) on delete cascade,
  team_id           integer not null references teams(id),
  player_id         integer references players(id) on delete set null,
  assist_player_id  integer references players(id) on delete set null,
  event_type        text not null check (event_type in ('goal', 'own_goal', 'yellow', 'red')),
  minute            integer not null check (minute between 1 and 120),
  created_at        timestamptz not null default now()
);

create table if not exists announcements (
  id            serial primary key,
  title         text not null,
  body          text not null,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists players_team_id_idx on players (team_id);
create index if not exists matches_status_kickoff_idx on matches (status, kickoff_at);
create index if not exists matches_matchday_idx on matches (matchday);
create index if not exists match_events_match_id_idx on match_events (match_id);
create index if not exists match_events_player_id_idx on match_events (player_id);
create index if not exists announcements_published_idx on announcements (published_at desc);
