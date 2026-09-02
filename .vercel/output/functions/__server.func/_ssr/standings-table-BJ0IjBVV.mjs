import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, s as signed } from "./utils-D5lQuapZ.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/standings-table-BJ0IjBVV.js
var import_jsx_runtime = require_jsx_runtime();
function StandingsTable({ rows, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] border-collapse text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "text-left text-[11px] font-semibold uppercase tracking-wider text-faint",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Pos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: "Team"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "P"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "W"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "D"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "L"
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "GF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "GA"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-2 py-2 text-center font-medium",
						children: "GD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 text-center font-medium",
						children: "Pts"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border/80 hover:bg-accent/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 tabular-nums text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("inline-flex size-6 items-center justify-center rounded-[var(--radius-xs)] text-xs font-semibold", row.position === 1 && "bg-primary text-primary-foreground", row.position <= 3 && row.position !== 1 && "bg-muted text-foreground"),
							children: row.position
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "sticky left-0 bg-card px-3 py-2.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/teams/$slug",
							params: { slug: row.team.slug },
							className: "flex items-center gap-2.5 font-medium hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
								team: row.team,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: row.team.name
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums",
						children: row.played
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums",
						children: row.won
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums",
						children: row.drawn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums",
						children: row.lost
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums",
						children: row.goalsFor
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums",
						children: row.goalsAgainst
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2 py-2.5 text-center tabular-nums text-muted-foreground",
						children: signed(row.goalDifference)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 text-center font-display text-base font-semibold tabular-nums",
						children: row.points
					})
				]
			}, row.team.id)) })]
		})
	});
}
//#endregion
export { StandingsTable as t };
