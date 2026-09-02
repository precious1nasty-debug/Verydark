import { cn } from "@/lib/utils";
import type { TeamRef } from "@/lib/league/types";

type Props = {
  team: Pick<TeamRef, "name" | "shortName" | "primaryColor" | "secondaryColor">;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: 28, md: 40, lg: 72 };

export function TeamBadge({ team, size = "md", className }: Props) {
  const px = sizes[size];
  const initials = team.shortName.slice(0, 3);
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 72"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M32 2 L58 12 V34 C58 50 48 62 32 70 C16 62 6 50 6 34 V12 Z"
        fill={team.primaryColor}
      />
      <path
        d="M32 6 L54 14 V34 C54 48 45 58 32 65 C19 58 10 48 10 34 V14 Z"
        fill="none"
        stroke={team.secondaryColor}
        strokeWidth="2"
        opacity="0.85"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fill={team.secondaryColor}
        fontFamily="Oswald, sans-serif"
        fontSize="16"
        fontWeight="600"
        letterSpacing="0.5"
      >
        {initials}
      </text>
    </svg>
  );
}
