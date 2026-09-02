import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as getTeams, i as Route$3 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams-CChxCALT.js
var import_jsx_runtime = require_jsx_runtime();
function TeamsPage() {
	const initial = Route$3.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "teams"],
		queryFn: () => getTeams(),
		initialData: initial
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Clubs",
			title: "Teams",
			description: "Ten sides contesting the 2026 Dream League championship."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: data.teams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/teams/$slug",
				params: { slug: team.slug },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "h-full transition-colors hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-4 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
							team,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl",
									children: team.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: team.stadium
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs uppercase tracking-wider text-faint",
									children: ["Est. ", team.founded]
								})
							]
						})]
					})
				})
			}, team.id))
		})]
	});
}
//#endregion
export { TeamsPage as component };
