import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display tracking-wide text-foreground">Dream League · 2026</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/table" className="hover:text-foreground">
            Table
          </Link>
          <Link to="/fixtures" className="hover:text-foreground">
            Fixtures
          </Link>
          <Link to="/announcements" className="hover:text-foreground">
            News
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/login" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
