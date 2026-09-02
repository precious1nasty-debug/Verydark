import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { N as getStandings, a as Route$4 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as StandingsTable } from "./standings-table-BJ0IjBVV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/table-D1-utIM1.js
var import_jsx_runtime = require_jsx_runtime();
function TablePage() {
	const initial = Route$4.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "standings"],
		queryFn: () => getStandings(),
		initialData: initial,
		refetchInterval: 15e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: `Season ${data.meta.season} · Matchday ${data.currentMatchday}`,
			title: "League table",
			description: "Three points for a win, one for a draw. Ranked by points, then goal difference, then goals scored."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "px-2 py-3 sm:px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StandingsTable, { rows: data.table })
		}) })]
	});
}
//#endregion
export { TablePage as component };
