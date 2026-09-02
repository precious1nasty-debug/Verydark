import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { I as getTopScorers, s as Route$6 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scorers-CM1O1fyG.js
var import_jsx_runtime = require_jsx_runtime();
function ScorersPage() {
	const initial = Route$6.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "scorers"],
		queryFn: () => getTopScorers(),
		initialData: initial
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Golden boot",
			title: "Top scorers",
			description: "League goals only. Own goals are not credited to the scorer."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "overflow-x-auto px-0 py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[520px] border-collapse text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-[11px] font-semibold uppercase tracking-wider text-faint",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-2 font-medium",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Player"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Club"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 text-center font-medium",
							children: "G"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-2 text-center font-medium",
							children: "A"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.scorers.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-3 tabular-nums text-muted-foreground",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-xs text-faint",
								children: ["#", s.shirtNumber]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/teams/$slug",
								params: { slug: s.team.slug },
								className: "inline-flex items-center gap-2 hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
									team: s.team,
									size: "sm"
								}), s.team.name]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 text-center font-display text-lg font-semibold tabular-nums",
							children: s.goals
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-3 text-center tabular-nums text-muted-foreground",
							children: s.assists
						})
					]
				}, s.playerId)) })]
			})
		}) })]
	});
}
//#endregion
export { ScorersPage as component };
