export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="E-Mitra Home">
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-full"
        aria-hidden="true"
      >
        <path d="M0 50 A 50 50 0 0 1 100 50" fill="hsl(var(--primary))" />
        <path
          d="M0 50 Q 50 65 100 50 L 100 65 Q 50 80 0 65 Z"
          fill="hsl(var(--accent))"
        />
        <path d="M0 65 L 100 65 L 100 100 L 0 100 Z" fill="hsl(var(--background))" />
        <circle cx="50" cy="50" r="20" fill="#FFFFFF" />
        <path
          d="M60,55 L60,40 C60,35 65,35 65,40 L65,75 L70,75 L70,42 C70,32 60,32 60,42"
          fill="hsl(var(--foreground))"
          transform="translate(10, -5)"
        />
        <path
          d="M85,55 L85,45 C85,40 90,40 90,45 L90,75 L95,75 L95,48 C95,38 85,38 85,48"
          fill="hsl(var(--foreground))"
          transform="translate(-15, -10)"
        />
        <text
          x="50"
          y="90"
          fontFamily="PT Sans, sans-serif"
          fontSize="20"
          fill="hsl(var(--foreground))"
          textAnchor="middle"
          fontWeight="bold"
        >
          E-M
        </text>
      </svg>
      <h1 className="text-xl font-bold font-headline text-foreground hidden sm:inline-block">
        E-Mitra
      </h1>
    </div>
  );
}
