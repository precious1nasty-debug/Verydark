export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      {kicker ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {kicker}
        </p>
      ) : null}
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
