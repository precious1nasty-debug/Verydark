import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatKickoff } from "./utils-D5lQuapZ.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as getMatch, r as Route$2 } from "./router-BWdoTGzk.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
import { n as LiveBadge, t as Badge } from "./live-badge-D3xux8O0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matches._id-C9HmbH8i.js
var import_jsx_runtime = require_jsx_runtime();
function MatchPage() {
	const { id } = Route$2.useParams();
	const initial = Route$2.useLoaderData();
	const { data } = useQuery({
		queryKey: [
			"league",
			"match",
			id
		],
		queryFn: () => getMatch({ data: Number(id) }),
		initialData: initial,
		refetchInterval: (q) => q.state.data?.match?.status === "live" ? 4e3 : false
	});
	if (!data.match) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-6xl flex-1 px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Match not found."
		})
	});
	const m = data.match;
	const { date, time } = formatKickoff(m.kickoffAt);
	const goals = data.events.filter((e) => e.eventType === "goal" || e.eventType === "own_goal");
	const cards = data.events.filter((e) => e.eventType === "yellow" || e.eventType === "red");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl flex-1 px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground",
				children: [
					"Matchday ",
					m.matchday,
					" · ",
					date,
					" · ",
					time
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex justify-center",
				children: m.status === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {}) : m.status === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: "Full time"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "muted",
					children: "Upcoming"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Club, { team: m.home }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center",
						children: m.status === "upcoming" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl text-muted-foreground",
							children: "VS"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `font-display text-5xl font-semibold tabular-nums ${m.status === "live" ? "text-live" : ""}`,
							children: [
								m.homeScore,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-1 text-faint",
									children: "–"
								}),
								m.awayScore
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Club, { team: m.away })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-sm text-faint",
				children: m.venue
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Goal scorers" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: goals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No goals recorded."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: goals.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, {
						event: e,
						homeId: m.home.id
					}, e.id))
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Cards" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No cards recorded."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: cards.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, {
						event: e,
						homeId: m.home.id
					}, e.id))
				}) })] })]
			})
		]
	});
}
function Club({ team }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/teams/$slug",
		params: { slug: team.slug },
		className: "flex flex-col items-center gap-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
			team,
			size: "lg"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: team.name
		})]
	});
}
function EventRow({ event, homeId }) {
	const label = event.eventType === "goal" ? "Goal" : event.eventType === "own_goal" ? "Own goal" : event.eventType === "yellow" ? "Yellow" : "Red";
	const home = event.teamId === homeId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: `flex items-center gap-3 text-sm ${home ? "" : "flex-row-reverse text-right"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "w-10 tabular-nums text-muted-foreground",
				children: [event.minute, "'"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: event.playerName ?? "Unknown"
				}), event.assistPlayerName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block text-xs text-muted-foreground",
					children: ["Assist ", event.assistPlayerName]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] uppercase tracking-wider text-faint",
				children: label
			})
		]
	});
}
//#endregion
export { MatchPage as component };
