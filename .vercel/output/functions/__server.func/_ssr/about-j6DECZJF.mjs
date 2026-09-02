import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as getAbout, f as Route$12 } from "./router-BWdoTGzk.mjs";
import { t as PageHeader } from "./page-header-D7lGUlpu.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-j6DECZJF.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	const initial = Route$12.useLoaderData();
	const { data } = useQuery({
		queryKey: ["league", "about"],
		queryFn: () => getAbout(),
		initialData: initial
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl flex-1 px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: data.meta.name,
				title: "About the league"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base leading-relaxed text-muted-foreground",
						children: data.meta.about
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Competition format" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [data.teamCount, " clubs, single round-robin, nine matchdays."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Home and away is not mirrored this season — each pairing is played once." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Live matches update on this site as the score changes." })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "How the table works" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Win 3 points · Draw 1 point · Loss 0 points." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tie-breakers: goal difference, then goals scored, then club name." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Only finished matches count toward the table. Live scores do not." })
					]
				})] })]
			})
		]
	});
}
//#endregion
export { AboutPage as component };
