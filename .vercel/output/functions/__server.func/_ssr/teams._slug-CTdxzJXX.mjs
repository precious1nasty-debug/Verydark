import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as signed } from "./utils-D5lQuapZ.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as getTeam, n as Route$1 } from "./router-BWdoTGzk.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
import { t as MatchCard } from "./match-card-6VL55pMg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams._slug-CTdxzJXX.js
var import_jsx_runtime = require_jsx_runtime();
function TeamPage() {
	const { slug } = Route$1.useParams();
	const initial = Route$1.useLoaderData();
	const { data } = useQuery({
		queryKey: [
			"league",
			"team",
			slug
		],
		queryFn: () => getTeam({ data: slug }),
		initialData: initial
	});
	if (!data.team) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl flex-1 px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Club not found."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/teams",
			className: "mt-3 inline-block text-primary hover:underline",
			children: "Back to teams"
		})]
	});
	const { team, players, matches, standing } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex flex-wrap items-center gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
					team,
					size: "lg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
						children: team.shortName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-semibold sm:text-5xl",
						children: team.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							team.stadium,
							" · Coach ",
							team.coach,
							" · Founded ",
							team.founded
						]
					})
				] }),
				standing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto grid grid-cols-3 gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Pos",
							value: String(standing.position)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Pts",
							value: String(standing.points)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "GD",
							value: signed(standing.goalDifference)
						})
					]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[20rem_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Squad" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-5",
				children: [
					"GK",
					"DF",
					"MF",
					"FW"
				].map((pos) => {
					const group = players.filter((p) => p.position === pos);
					if (!group.length) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint",
						children: pos
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5",
						children: group.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-muted-foreground",
								children: ["#", p.shirtNumber]
							})]
						}, p.id))
					})] }, pos);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Fixtures & results"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: matches.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchCard, { match: m }, m.id))
				})]
			})]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-16 rounded-[var(--radius-sm)] bg-muted px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-faint",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-2xl font-semibold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { TeamPage as component };
