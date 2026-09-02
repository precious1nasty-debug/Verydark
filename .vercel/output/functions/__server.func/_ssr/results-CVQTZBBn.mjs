import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as getResults, c as Route$7 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { t as MatchCard } from "./match-card-6VL55pMg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-CVQTZBBn.js
var import_jsx_runtime = require_jsx_runtime();
function ResultsPage() {
	const initial = Route$7.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "results"],
		queryFn: () => getResults(),
		initialData: initial
	});
	const groups = groupByMatchday(data.matches);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Archive",
			title: "Results",
			description: "Finished matches with final scores. Open a match for scorers and cards."
		}), groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No results yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-10",
			children: groups.map(([md, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-4 font-display text-xl",
				children: ["Matchday ", md]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchCard, { match: m }, m.id))
			})] }, md))
		})]
	});
}
function groupByMatchday(matches) {
	const map = /* @__PURE__ */ new Map();
	for (const m of matches) {
		const list = map.get(m.matchday) ?? [];
		list.push(m);
		map.set(m.matchday, list);
	}
	return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
//#endregion
export { ResultsPage as component };
