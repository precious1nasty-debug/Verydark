import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as formatKickoff, n as cn } from "./utils-D5lQuapZ.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as getMatch, B as savePlayer, D as getAnnouncements, E as getAllMatchesAdmin, H as updateMatchScore, L as saveAnnouncement, R as saveMatch, S as deleteTeam, T as getAdminSession, V as saveTeam, _ as addMatchEvent, b as deleteMatchEvent, g as useCurrentUserState, h as RedirectToSignIn, m as Button, v as deleteAnnouncement, w as getAdminPlayers, x as deletePlayer, y as deleteMatch, z as saveMeta } from "./router-BWdoTGzk.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-DFOT-DhL.mjs";
import { t as TeamBadge } from "./team-badge-B46VFXIO.mjs";
import { n as LiveBadge, t as Badge } from "./live-badge-D3xux8O0.mjs";
import { t as Input } from "./input-t1jZ6B7J.mjs";
import { t as Label } from "./label-C7RkNWVy.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DaDIt2bb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,32rem)] max-h-[min(90vh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-xl)] bg-card p-6 shadow-[var(--shadow-card)] hairline", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-xl font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "sr-only",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "absolute top-4 right-4 grid size-11 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-accent",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children
			})
		]
	})] });
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-28 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center gap-1 rounded-[var(--radius-md)] bg-muted p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-card)]", className),
		...props
	});
}
var TabsContent = Content;
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const session = useQuery({
		queryKey: ["admin", "session"],
		queryFn: () => getAdminSession(),
		enabled: Boolean(user),
		retry: false
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-[var(--radius-sm)] bg-muted" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (session.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-48 animate-pulse rounded-[var(--radius-sm)] bg-muted" })
	});
	if (session.error || session.data?.isAdmin === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg flex-1 px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "No admin access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "An administrator is already registered for this league. Sign in with that account to manage the competition."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to the league"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
				children: "Office"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-semibold",
				children: "Admin dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 mb-6 text-sm text-muted-foreground",
				children: "Changes save to the database and show on the public site immediately."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "matches",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mb-6 flex h-auto w-full flex-wrap justify-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "matches",
								children: "Matches"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "teams",
								children: "Teams"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "players",
								children: "Players"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "news",
								children: "News"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "league",
								children: "League"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "matches",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchesAdmin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "teams",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamsAdmin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "players",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayersAdmin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "news",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsAdmin, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "league",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeagueAdmin, {
							initial: session.data.meta,
							onSaved: () => session.refetch()
						})
					})
				]
			})
		]
	});
}
function useInvalidate() {
	const qc = useQueryClient();
	return () => qc.invalidateQueries();
}
function MatchesAdmin() {
	const invalidate = useInvalidate();
	const { data } = useQuery({
		queryKey: ["admin", "matches"],
		queryFn: () => getAllMatchesAdmin()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [eventsFor, setEventsFor] = (0, import_react.useState)(null);
	const scoreMut = useMutation({
		mutationFn: updateMatchScore,
		onSuccess: () => {
			toast.success("Match updated");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const delMut = useMutation({
		mutationFn: (id) => deleteMatch({ data: id }),
		onSuccess: () => {
			toast.success("Fixture removed");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen(true),
					children: "Add fixture"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: data.matches.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"MD ",
									m.matchday,
									" · ",
									formatKickoff(m.kickoffAt).full,
									" · ",
									m.venue
								]
							}), m.status === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {}) : m.status === "finished" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: "Finished"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: "Upcoming"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex min-w-0 flex-1 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
										team: m.home,
										size: "sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: m.home.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBtn, {
											value: m.homeScore,
											onChange: (homeScore) => scoreMut.mutate({ data: {
												matchId: m.id,
												homeScore,
												awayScore: m.awayScore,
												status: m.status === "upcoming" ? "live" : m.status
											} })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "–"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBtn, {
											value: m.awayScore,
											onChange: (awayScore) => scoreMut.mutate({ data: {
												matchId: m.id,
												homeScore: m.homeScore,
												awayScore,
												status: m.status === "upcoming" ? "live" : m.status
											} })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex min-w-0 flex-1 items-center justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: m.away.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
										team: m.away,
										size: "sm"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								[
									"upcoming",
									"live",
									"finished"
								].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: m.status === status ? "default" : "outline",
									onClick: () => scoreMut.mutate({ data: {
										matchId: m.id,
										homeScore: m.homeScore,
										awayScore: m.awayScore,
										status
									} }),
									children: status === "upcoming" ? "Upcoming" : status === "live" ? "Live" : "Finished"
								}, status)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => setEventsFor(m),
									children: "Events"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "text-destructive",
									onClick: () => {
										if (confirm("Delete this fixture?")) delMut.mutate(m.id);
									},
									children: "Delete"
								})
							]
						})
					]
				}) }, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Add fixture",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchForm, {
						teams: data.teams,
						onDone: () => {
							setOpen(false);
							invalidate();
						}
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(eventsFor),
				onOpenChange: (v) => !v && setEventsFor(null),
				children: eventsFor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Match events",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventsForm, {
						match: eventsFor,
						onChanged: invalidate
					})
				}) : null
			})
		]
	});
}
function ScoreBtn({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "icon",
				variant: "outline",
				className: "size-9",
				onClick: () => onChange(Math.max(0, value - 1)),
				children: "–"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-8 text-center font-display text-xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "icon",
				variant: "outline",
				className: "size-9",
				onClick: () => onChange(value + 1),
				children: "+"
			})
		]
	});
}
function MatchForm({ teams, onDone }) {
	const [homeTeamId, setHomeTeamId] = (0, import_react.useState)(teams[0]?.id ?? 0);
	const [awayTeamId, setAwayTeamId] = (0, import_react.useState)(teams[1]?.id ?? 0);
	const [matchday, setMatchday] = (0, import_react.useState)(1);
	const [kickoffAt, setKickoffAt] = (0, import_react.useState)("");
	const [venue, setVenue] = (0, import_react.useState)(teams[0]?.stadium ?? "");
	const mut = useMutation({
		mutationFn: saveMatch,
		onSuccess: () => {
			toast.success("Fixture saved");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate({ data: {
				matchday,
				homeTeamId,
				awayTeamId,
				kickoffAt: new Date(kickoffAt).toISOString(),
				venue,
				status: "upcoming"
			} });
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Matchday",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: 1,
					value: matchday,
					onChange: (e) => setMatchday(Number(e.target.value)),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Home",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
					value: homeTeamId,
					onChange: (e) => {
						const id = Number(e.target.value);
						setHomeTeamId(id);
						const t = teams.find((x) => x.id === id);
						if (t) setVenue(t.stadium);
					},
					children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.name
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Away",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
					value: awayTeamId,
					onChange: (e) => setAwayTeamId(Number(e.target.value)),
					children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.name
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Kickoff",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "datetime-local",
					value: kickoffAt,
					onChange: (e) => setKickoffAt(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Venue",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: venue,
					onChange: (e) => setVenue(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: mut.isPending,
				children: "Save fixture"
			})
		]
	});
}
function EventsForm({ match, onChanged }) {
	const playersQ = useQuery({
		queryKey: ["admin", "players"],
		queryFn: () => getAdminPlayers()
	});
	const detail = useQuery({
		queryKey: [
			"league",
			"match",
			String(match.id)
		],
		queryFn: () => getMatch({ data: match.id })
	});
	const [teamId, setTeamId] = (0, import_react.useState)(match.home.id);
	const [playerId, setPlayerId] = (0, import_react.useState)("");
	const [assistId, setAssistId] = (0, import_react.useState)("");
	const [eventType, setEventType] = (0, import_react.useState)("goal");
	const [minute, setMinute] = (0, import_react.useState)(1);
	const addMut = useMutation({
		mutationFn: addMatchEvent,
		onSuccess: () => {
			toast.success("Event added");
			detail.refetch();
			onChanged();
		},
		onError: (e) => toast.error(e.message)
	});
	const delMut = useMutation({
		mutationFn: (id) => deleteMatchEvent({ data: id }),
		onSuccess: () => {
			toast.success("Event removed");
			detail.refetch();
			onChanged();
		}
	});
	const players = (playersQ.data?.players ?? []).filter((p) => p.teamId === teamId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2 text-sm",
			children: (detail.data?.events ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					e.minute,
					"' ",
					e.eventType,
					" · ",
					e.playerName ?? "—",
					e.assistPlayerName ? ` (A ${e.assistPlayerName})` : ""
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => delMut.mutate(e.id),
					children: "Remove"
				})]
			}, e.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				addMut.mutate({ data: {
					matchId: match.id,
					teamId,
					playerId: playerId === "" ? null : Number(playerId),
					assistPlayerId: assistId === "" ? null : Number(assistId),
					eventType,
					minute,
					bumpScore: eventType === "goal" || eventType === "own_goal"
				} });
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Club",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
						value: teamId,
						onChange: (e) => {
							setTeamId(Number(e.target.value));
							setPlayerId("");
							setAssistId("");
						},
						children: [match.home, match.away].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t.id,
							children: t.name
						}, t.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Type",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
						value: eventType,
						onChange: (e) => setEventType(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "goal",
								children: "Goal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "own_goal",
								children: "Own goal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "yellow",
								children: "Yellow card"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "red",
								children: "Red card"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Player",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
						value: playerId,
						onChange: (e) => setPlayerId(e.target.value ? Number(e.target.value) : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select"
						}), players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: p.id,
							children: [
								p.name,
								" #",
								p.shirtNumber
							]
						}, p.id))]
					})
				}),
				eventType === "goal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Assist",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
						value: assistId,
						onChange: (e) => setAssistId(e.target.value ? Number(e.target.value) : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "None"
						}), players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Minute",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						max: 120,
						value: minute,
						onChange: (e) => setMinute(Number(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: addMut.isPending,
					children: "Add event"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: "Goals increment the live score automatically."
				})
			]
		})]
	});
}
function TeamsAdmin() {
	const invalidate = useInvalidate();
	const { data } = useQuery({
		queryKey: ["admin", "matches"],
		queryFn: () => getAllMatchesAdmin()
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const delMut = useMutation({
		mutationFn: (id) => deleteTeam({ data: id }),
		onSuccess: () => {
			toast.success("Team removed");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setCreating(true),
					children: "Add team"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: data.teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center gap-3 pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, { team: t }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: t.stadium
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setEditing(t),
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-destructive",
							onClick: () => {
								if (confirm("Delete this team?")) delMut.mutate(t.id);
							},
							children: "Delete"
						})
					]
				}) }, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: creating || Boolean(editing),
				onOpenChange: (v) => {
					if (!v) {
						setCreating(false);
						setEditing(null);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: editing ? "Edit team" : "Add team",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamForm, {
						initial: editing,
						onDone: () => {
							setCreating(false);
							setEditing(null);
							invalidate();
						}
					})
				})
			})
		]
	});
}
function TeamForm({ initial, onDone }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [shortName, setShortName] = (0, import_react.useState)(initial?.shortName ?? "");
	const [slug, setSlug] = (0, import_react.useState)(initial?.slug ?? "");
	const [primaryColor, setPrimaryColor] = (0, import_react.useState)(initial?.primaryColor ?? "#1B4B5A");
	const [secondaryColor, setSecondaryColor] = (0, import_react.useState)(initial?.secondaryColor ?? "#E8EEE9");
	const [coach, setCoach] = (0, import_react.useState)(initial?.coach ?? "");
	const [founded, setFounded] = (0, import_react.useState)(initial?.founded ?? "");
	const [stadium, setStadium] = (0, import_react.useState)(initial?.stadium ?? "");
	const mut = useMutation({
		mutationFn: saveTeam,
		onSuccess: () => {
			toast.success("Team saved");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate({ data: {
				id: initial?.id,
				name,
				shortName,
				slug,
				primaryColor,
				secondaryColor,
				coach,
				founded,
				stadium
			} });
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Short",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: shortName,
						onChange: (e) => setShortName(e.target.value),
						required: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Slug",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: slug,
						onChange: (e) => setSlug(e.target.value),
						required: true
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "color",
						value: primaryColor,
						onChange: (e) => setPrimaryColor(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "color",
						value: secondaryColor,
						onChange: (e) => setSecondaryColor(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Coach",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: coach,
					onChange: (e) => setCoach(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Founded",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: founded,
					onChange: (e) => setFounded(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Stadium",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: stadium,
					onChange: (e) => setStadium(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: mut.isPending,
				children: "Save team"
			})
		]
	});
}
function PlayersAdmin() {
	const invalidate = useInvalidate();
	const { data } = useQuery({
		queryKey: ["admin", "players"],
		queryFn: () => getAdminPlayers()
	});
	const [teamFilter, setTeamFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const delMut = useMutation({
		mutationFn: (id) => deletePlayer({ data: id }),
		onSuccess: () => {
			toast.success("Player removed");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const list = (0, import_react.useMemo)(() => {
		if (!data) return [];
		if (teamFilter === "all") return data.players;
		return data.players.filter((p) => p.teamId === teamFilter);
	}, [data, teamFilter]);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
					value: teamFilter,
					onChange: (e) => setTeamFilter(e.target.value === "all" ? "all" : Number(e.target.value)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All clubs"
					}), data.teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.name
					}, t.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "ml-auto",
					onClick: () => setCreating(true),
					children: "Add player"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto px-0 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[520px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[11px] uppercase tracking-wider text-faint",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2",
								children: "Player"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2",
								children: "No"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2",
								children: "Pos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2",
								children: "Club"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((p) => {
						const team = data.teams.find((t) => t.id === p.teamId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 tabular-nums",
									children: p.shirtNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: p.position
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: team?.shortName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-2 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setEditing(p),
										children: "Edit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-destructive",
										onClick: () => delMut.mutate(p.id),
										children: "Delete"
									})]
								})
							]
						}, p.id);
					}) })]
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: creating || Boolean(editing),
				onOpenChange: (v) => {
					if (!v) {
						setCreating(false);
						setEditing(null);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: editing ? "Edit player" : "Add player",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerForm, {
						teams: data.teams,
						initial: editing,
						defaultTeamId: teamFilter === "all" ? data.teams[0]?.id : teamFilter,
						onDone: () => {
							setCreating(false);
							setEditing(null);
							invalidate();
						}
					})
				})
			})
		]
	});
}
function PlayerForm({ teams, initial, defaultTeamId, onDone }) {
	const [teamId, setTeamId] = (0, import_react.useState)(initial?.teamId ?? defaultTeamId ?? teams[0]?.id ?? 0);
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [shirtNumber, setShirtNumber] = (0, import_react.useState)(initial?.shirtNumber ?? 99);
	const [position, setPosition] = (0, import_react.useState)(initial?.position ?? "MF");
	const mut = useMutation({
		mutationFn: savePlayer,
		onSuccess: () => {
			toast.success("Player saved");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			e.preventDefault();
			mut.mutate({ data: {
				id: initial?.id,
				teamId,
				name,
				shirtNumber,
				position
			} });
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Club",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
					value: teamId,
					onChange: (e) => setTeamId(Number(e.target.value)),
					children: teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.name
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Number",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						max: 99,
						value: shirtNumber,
						onChange: (e) => setShirtNumber(Number(e.target.value))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Position",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 text-sm",
						value: position,
						onChange: (e) => setPosition(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "GK",
								children: "GK"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DF",
								children: "DF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "MF",
								children: "MF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "FW",
								children: "FW"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: mut.isPending,
				children: "Save player"
			})
		]
	});
}
function NewsAdmin() {
	const invalidate = useInvalidate();
	const { data } = useQuery({
		queryKey: ["league", "announcements"],
		queryFn: () => getAnnouncements()
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const mut = useMutation({
		mutationFn: saveAnnouncement,
		onSuccess: () => {
			toast.success("Announcement saved");
			setTitle("");
			setBody("");
			setEditingId(null);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const delMut = useMutation({
		mutationFn: (id) => deleteAnnouncement({ data: id }),
		onSuccess: () => {
			toast.success("Removed");
			invalidate();
		}
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-lg)] bg-muted" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: editingId ? "Edit announcement" : "Post announcement" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				mut.mutate({ data: {
					id: editingId ?? void 0,
					title,
					body
				} });
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Body",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mut.isPending,
					children: editingId ? "Update" : "Publish"
				})
			]
		}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: data.announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: a.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-3 text-sm text-muted-foreground",
						children: a.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								setEditingId(a.id);
								setTitle(a.title);
								setBody(a.body);
							},
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-destructive",
							onClick: () => delMut.mutate(a.id),
							children: "Delete"
						})]
					})
				]
			}) }, a.id))
		})]
	});
}
function LeagueAdmin({ initial, onSaved }) {
	const [name, setName] = (0, import_react.useState)(initial.name);
	const [season, setSeason] = (0, import_react.useState)(initial.season);
	const [tagline, setTagline] = (0, import_react.useState)(initial.tagline);
	const [about, setAbout] = (0, import_react.useState)(initial.about);
	const mut = useMutation({
		mutationFn: saveMeta,
		onSuccess: () => {
			toast.success("League details saved");
			onSaved();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				mut.mutate({ data: {
					name,
					season,
					tagline,
					about
				} });
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Season",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: season,
						onChange: (e) => setSeason(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tagline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tagline,
						onChange: (e) => setTagline(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "About",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: about,
						onChange: (e) => setAbout(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mut.isPending,
					children: "Save"
				})
			]
		})
	}) });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminPage as component };
