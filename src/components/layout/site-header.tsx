import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Shield } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/fixtures", label: "Fixtures" },
  { to: "/results", label: "Results" },
  { to: "/table", label: "Table" },
  { to: "/scorers", label: "Scorers" },
  { to: "/stats", label: "Stats" },
  { to: "/teams", label: "Teams" },
  { to: "/announcements", label: "News" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { user, isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground">
            <Shield className="size-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm tracking-[0.14em] text-primary">
              DREAM
            </span>
            <span className="block font-display text-base leading-none">LEAGUE</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-[var(--radius-sm)] px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active && "bg-muted text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/admin">Admin</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Admin login</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <p className="font-display text-lg">Dream League</p>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center rounded-[var(--radius-sm)] px-3 text-sm hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <SignedIn>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center rounded-[var(--radius-sm)] px-3 text-sm hover:bg-accent"
                  >
                    Admin
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center rounded-[var(--radius-sm)] px-3 text-sm hover:bg-accent"
                  >
                    Admin login
                  </Link>
                </SignedOut>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
