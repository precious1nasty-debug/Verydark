import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Trophy, o as Flame, s as Calendar } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { k as getHome, m as Button, p as Route$13 } from "./router-BWdoTGzk.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
import { n as LiveBadge } from "./live-badge-D3xux8O0.mjs";
import { t as MatchCard } from "./match-card-6VL55pMg.mjs";
import { t as StandingsTable } from "./standings-table-BJ0IjBVV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D5WmXChI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Countdown({ target }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	const diff = Math.max(0, new Date(target).getTime() - now);
	const days = Math.floor(diff / 864e5);
	const hours = Math.floor(diff % 864e5 / 36e5);
	const minutes = Math.floor(diff % 36e5 / 6e4);
	const seconds = Math.floor(diff % 6e4 / 1e3);
	if (diff === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-lg tracking-wide text-primary",
		children: "Kickoff"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
				value: days,
				label: "Days"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
				value: hours,
				label: "Hrs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
				value: minutes,
				label: "Min"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
				value: seconds,
				label: "Sec"
			})
		]
	});
}
function Unit({ value, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-14 rounded-[var(--radius-sm)] bg-muted px-2 py-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-2xl font-semibold tabular-nums leading-none",
			children: String(value).padStart(2, "0")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[10px] uppercase tracking-wider text-faint",
			children: label
		})]
	});
}
function Home() {
	const initial = Route$13.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "home"],
		queryFn: () => getHome(),
		initialData: initial,
		refetchInterval: (q) => q.state.data?.liveMatches.length ? 5e3 : 2e4
	});
	const live = data.liveMatches[0];
	const next = data.upcoming[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border/80",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pitch-grid pointer-events-none absolute inset-0 opacity-80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.22em] text-primary",
						children: [
							"Season ",
							data.meta.season,
							" · Matchday ",
							data.currentMatchday
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl",
						children: data.meta.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-lg text-lg text-muted-foreground",
						children: data.meta.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/table",
								children: "League table"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/fixtures",
								children: "Fixtures"
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "In play" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Matchday ", live.matchday]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Next kickoff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: next ? `Matchday ${next.matchday}` : "Season complete"
					})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scoreboard, { match: live }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/matches/$id",
								params: { id: String(live.id) },
								children: "Match centre"
							})
						})]
					}) : next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniTeam, { team: next.home }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-sm text-muted-foreground",
									children: "VS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniTeam, {
									team: next.away,
									align: "right"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { target: next.kickoffAt })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No remaining fixtures."
					}) })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-primary" }), "Latest results"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/results",
							className: "text-sm text-primary hover:underline",
							children: "All results"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "grid gap-3 sm:grid-cols-2",
						children: data.latestResults.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchCard, {
							match: m,
							compact: true
						}, m.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-primary" }), "Top three"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingsTable, {
						rows: data.top3,
						compact: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "mt-3 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/table",
							children: "Full table"
						})
					})] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4 text-primary" }), "Top scorer"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: data.topScorer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/scorers",
						className: "flex items-center gap-3 rounded-[var(--radius-sm)] p-1 hover:bg-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, { team: data.topScorer.team }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: data.topScorer.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: data.topScorer.team.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "ml-auto font-display text-3xl font-semibold tabular-nums",
								children: data.topScorer.goals
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No goals recorded yet."
					}) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upcoming fixtures" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/fixtures",
							className: "text-sm text-primary hover:underline",
							children: "All fixtures"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: data.upcoming.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchCard, {
							match: m,
							compact: true
						}, m.id))
					})]
				})
			]
		})]
	});
}
function Scoreboard({ match }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[1fr_auto_1fr] items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniTeam, { team: match.home }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-4xl font-semibold tabular-nums text-live",
					children: [
						match.homeScore,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-1 text-faint",
							children: "–"
						}),
						match.awayScore
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniTeam, {
				team: match.away,
				align: "right"
			})
		]
	});
}
function MiniTeam({ team, align }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex min-w-0 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
			team,
			size: "md"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate text-sm font-medium",
			children: team.name
		})]
	});
}
//#endregion
export { Home as component };
