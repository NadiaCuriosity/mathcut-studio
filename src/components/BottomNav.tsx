import { NavLink } from "react-router-dom";

const tabs = [
  {
    path: "/",
    label: "Studio",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8" />
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    path: "/practice",
    label: "Shoot",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a1 1 0 001-1V9H3v10a1 1 0 001 1z" />
        <path d="M3 9l3-4h12l3 4" />
        <path d="M8 5l3 4M14 5l3 4" />
      </svg>
    ),
  },
  {
    path: "/movies",
    label: "Movies",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M7 2v20M17 2v20M2 7h5M17 7h5M2 12h20M2 17h5M17 17h5" />
      </svg>
    ),
  },
  {
    path: "/awards",
    label: "Awards",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4" />
        <path d="M7 4h10v7a5 5 0 01-10 0V4z" />
        <path d="M7 8H4a1 1 0 00-1 1v1a3 3 0 003 3h1M17 8h3a1 1 0 011 1v1a3 3 0 01-3 3h-1" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav
      className="flex shrink-0"
      style={{
        background: "var(--colour-bg-elevated)",
        borderTop: "1px solid rgba(230, 180, 34, 0.1)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === "/"}
          className="flex-1 flex flex-col items-center py-2.5 relative"
          style={({ isActive }) => ({
            color: isActive
              ? "var(--colour-accent-gold)"
              : "var(--colour-text-secondary)",
            textDecoration: "none",
            transition: "color 0.2s",
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                  style={{
                    width: "32px",
                    background: "var(--colour-accent-gold)",
                  }}
                />
              )}
              {tab.icon}
              <span
                className="mt-0.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.02em",
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {tab.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
