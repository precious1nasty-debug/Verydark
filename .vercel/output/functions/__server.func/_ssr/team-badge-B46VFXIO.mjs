import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./utils-D5lQuapZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-badge-B46VFXIO.js
var import_jsx_runtime = require_jsx_runtime();
var sizes = {
	sm: 28,
	md: 40,
	lg: 72
};
function TeamBadge({ team, size = "md", className }) {
	const px = sizes[size];
	const initials = team.shortName.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: px,
		height: px,
		viewBox: "0 0 64 72",
		className: cn("shrink-0", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 2 L58 12 V34 C58 50 48 62 32 70 C16 62 6 50 6 34 V12 Z",
				fill: team.primaryColor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 6 L54 14 V34 C54 48 45 58 32 65 C19 58 10 48 10 34 V14 Z",
				fill: "none",
				stroke: team.secondaryColor,
				strokeWidth: "2",
				opacity: "0.85"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "32",
				y: "40",
				textAnchor: "middle",
				fill: team.secondaryColor,
				fontFamily: "Oswald, sans-serif",
				fontSize: "16",
				fontWeight: "600",
				letterSpacing: "0.5",
				children: initials
			})
		]
	});
}
//#endregion
export { TeamBadge as t };
