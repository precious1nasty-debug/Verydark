import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatKickoff, n as cn } from "./utils-D5lQuapZ.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
import { n as LiveBadge, t as Badge } from "./live-badge-D3xux8O0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/match-card-6VL55pMg.js
var import_jsx_runtime = require_jsx_runtime();
function MatchCard({ match, compact }) {
	const { date, time } = formatKickoff(match.kickoffAt);
	const finished = match.status === "finished";
	const live = match.status === "live";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/matches/$id",
		params: { id: String(match.id) },
		className: cn("block rounded-[var(--radius-md)] bg-card p-4 shadow-[var(--shadow-card)] hairline transition-[transform,background-color] duration-150 hover:bg-accent", compact && "p-3"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"MD ",
					match.matchday,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1.5 text-faint",
						children: "/"
					}),
					date,
					" · ",
					time
				] }), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {}) : finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					children: "Full time"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "muted",
					children: "Upcoming"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLine, {
						team: match.home,
						align: "right"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, { match }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamLine, {
						team: match.away,
						align: "left"
					})
				]
			}),
			match.venue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-xs text-faint",
				children: match.venue
			}) : null
		]
	});
}
function TeamLine({ team, align }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-w-0 items-center gap-2", align === "right" ? "flex-row-reverse text-right" : "flex-row"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
			team,
			size: "sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm font-medium",
				children: team.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-wider text-faint",
				children: team.shortName
			})]
		})]
	});
}
function Score({ match }) {
	if (match.status === "upcoming") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-w-14 text-center font-display text-sm uppercase tracking-wider text-muted-foreground",
		children: "vs"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-w-16 text-center font-display text-2xl font-semibold tabular-nums leading-none", match.status === "live" && "text-live"),
		children: [
			match.homeScore,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-1 text-faint",
				children: "–"
			}),
			match.awayScore
		]
	});
}
//#endregion
export { MatchCard as t };
