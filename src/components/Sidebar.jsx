import { COLORS, SEV_COLORS } from "../data/constants";

const NAV_ITEMS = [
  { id: "overview", icon: "⬡", label: "Overview" },
  { id: "metrics", icon: "◈", label: "Metrics" },
  { id: "trades", icon: "◎", label: "Trades" },
  { id: "logs", icon: "≡", label: "Logs" },
];

export function Sidebar({
  activeTab,
  setActiveTab,
  streaming,
  toggleStreaming,
  toggleDark,
  dark,
  connectionOk,
  alerts,
  theme,
}) {
  const { surface, border, text, textMuted, surface2 } = theme;
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <aside
      style={{
        width: 200,
        minWidth: 200,
        background: surface,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: connectionOk ? COLORS.teal : COLORS.red,
              boxShadow: connectionOk
                ? `0 0 6px ${COLORS.teal}`
                : `0 0 6px ${COLORS.red}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.1em",
              color: text,
            }}
          >
            NEXUS
          </span>
        </div>
        <div style={{ fontSize: 10, color: textMuted, marginTop: 4, paddingLeft: 16 }}>
          realtime ops
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 10px" }}>
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                background: active ? surface2 : "transparent",
                border: `1px solid ${active ? border : "transparent"}`,
                borderRadius: 8,
                color: active ? text : textMuted,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{ letterSpacing: "0.04em" }}>{item.label}</span>
              {item.id === "logs" && unread > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: COLORS.red,
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 10,
                    padding: "1px 6px",
                    fontWeight: 600,
                  }}
                >
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div style={{ padding: "16px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={toggleStreaming}
          style={{
            background: streaming ? "#1a2e1a" : surface2,
            border: `1px solid ${streaming ? COLORS.teal + "55" : border}`,
            color: streaming ? COLORS.teal : textMuted,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <span>{streaming ? "⏸" : "▶"}</span>
          <span>{streaming ? "LIVE" : "PAUSED"}</span>
          {streaming && (
            <span
              style={{
                marginLeft: "auto",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: COLORS.teal,
                animation: "pulse 1.5s infinite",
              }}
            />
          )}
        </button>

        <button
          onClick={toggleDark}
          style={{
            background: "transparent",
            border: `1px solid ${border}`,
            color: textMuted,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <span>{dark ? "☀" : "🌙"}</span>
          <span>{dark ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </aside>
  );
}
