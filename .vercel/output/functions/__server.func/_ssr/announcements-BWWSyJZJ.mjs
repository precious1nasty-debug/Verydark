import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatKickoff } from "./utils-D5lQuapZ.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as getAnnouncements, d as Route$10 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/announcements-BWWSyJZJ.js
var import_jsx_runtime = require_jsx_runtime();
function NewsPage() {
	const initial = Route$10.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "announcements"],
		queryFn: () => getAnnouncements(),
		initialData: initial
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl flex-1 px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Bulletin",
			title: "Announcements",
			description: "Official notes from the Dream League office."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: data.announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wider text-faint",
				children: formatKickoff(a.publishedAt).full
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: a.title })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: a.body
			}) })] }, a.id))
		})]
	});
}
//#endregion
export { NewsPage as component };
