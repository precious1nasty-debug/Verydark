import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { O as getFixtures, u as Route$9 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { t as MatchCard } from "./match-card-6VL55pMg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fixtures-Ca6MPjlC.js
var import_jsx_runtime = require_jsx_runtime();
function FixturesPage() {
	const initial = Route$9.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "fixtures"],
		queryFn: () => getFixtures(),
		initialData: initial,
		refetchInterval: (q) => q.state.data?.matches.some((m) => m.status === "live") ? 5e3 : 2e4
	});
	const groups = groupByMatchday(data.matches);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Calendar",
			title: "Fixtures",
			description: "Upcoming and live matches. Kickoff times shown in your local timezone."
		}), groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No remaining fixtures."
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
	return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
//#endregion
export { FixturesPage as component };
