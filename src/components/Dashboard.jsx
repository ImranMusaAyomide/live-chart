import { useState, useMemo } from "react";
import { Sidebar } from "./Sidebar";
import { OverviewTab } from "./OverviewTab";
import { MetricsTab } from "./MetricsTab";
import { TradeTable } from "./TradeTable";
import { ActivityFeed } from "./ActivityFeed";
import { useStream } from "../hooks/useStream";
import { useTheme } from "../hooks/useTheme";
import { COLORS } from "../data/constants";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { theme, card, toggleDark } = useTheme();
  const {
    streaming,
    toggleStreaming,
    metrics,
    logs,
    trades,
    alerts,
    connectionOk,
  } = useStream();

  const { bg, border, text, textMuted, dark } = theme;

  // Time-windowed metrics (last 60s default, controlled inside OverviewTab)
  const visibleMetrics = useMemo(() => {
    const cutoff = Date.now() - 60 * 1000;
    const filtered = metrics.filter((m) => m.ts >= cutoff);
    return filtered.length >= 2 ? filtered : metrics.slice(-30);
  }, [metrics]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: bg,
        color: text,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 13,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streaming={streaming}
        toggleStreaming={toggleStreaming}
        toggleDark={toggleDark}
        dark={dark}
        connectionOk={connectionOk}
        alerts={alerts}
        theme={theme}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Connection error banner */}
        {!connectionOk && (
          <div
            style={{
              background: "#3c1010",
              borderBottom: `1px solid ${COLORS.red}40`,
              padding: "6px 24px",
              fontSize: 12,
              color: COLORS.red,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            ⚠ Connection interrupted — attempting reconnect...
          </div>
        )}

        {/* Page content */}
        <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>
          {activeTab === "overview" && (
            <OverviewTab
              metrics={metrics}
              visibleMetrics={visibleMetrics}
              logs={logs}
              setActiveTab={setActiveTab}
              theme={theme}
              card={card}
            />
          )}
          {activeTab === "metrics" && (
            <MetricsTab
              visibleMetrics={visibleMetrics}
              theme={theme}
              card={card}
            />
          )}
          {activeTab === "trades" && (
            <TradeTable trades={trades} theme={theme} />
          )}
          {activeTab === "logs" && (
            <ActivityFeed logs={logs} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
}
