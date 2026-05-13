import { useState, useMemo } from "react";
import { MetricCard } from "./MetricCard";
import { TimeSeriesChart, NetworkChart, RadarChart, HeatmapGrid } from "./Charts";
import { ActivityFeed } from "./ActivityFeed";
import { COLORS } from "../data/constants";

export function OverviewTab({ metrics, visibleMetrics, logs, setActiveTab, theme, card }) {
  const [timeRange, setTimeRange] = useState(60);
  const { border, text, textMuted } = theme;

  const latest = metrics[metrics.length - 1] ?? {};
  const prev = metrics[metrics.length - 5] ?? {};
  const delta = (key) => {
    const d = (latest[key] ?? 0) - (prev[key] ?? 0);
    return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        <MetricCard label="CPU" value={latest.cpu} unit="%" color={COLORS.blue}
          sparkData={metrics.slice(-40).map((m) => m.cpu)} yMax={100} delta={delta("cpu")} theme={theme} />
        <MetricCard label="Memory" value={latest.memory} unit="%" color={COLORS.purple}
          sparkData={metrics.slice(-40).map((m) => m.memory)} yMax={100} delta={delta("memory")} theme={theme} />
        <MetricCard label="Network" value={latest.network} unit="MB/s" color={COLORS.teal}
          sparkData={metrics.slice(-40).map((m) => m.network)} yMax={1000} isBar delta={delta("network")} theme={theme} />
        <MetricCard label="Disk I/O" value={latest.disk} unit="MB/s" color={COLORS.amber}
          sparkData={metrics.slice(-40).map((m) => m.disk)} yMax={500} isBar delta={delta("disk")} theme={theme} />
        <MetricCard label="GPU" value={latest.gpu} unit="%" color={COLORS.coral}
          sparkData={metrics.slice(-40).map((m) => m.gpu)} yMax={100} delta={delta("gpu")} theme={theme} />
        <MetricCard label="Latency" value={latest.latency} unit="ms" color={COLORS.red}
          sparkData={metrics.slice(-40).map((m) => m.latency)} yMax={300} delta={delta("latency")} theme={theme} />
      </div>

      {/* Time range */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: textMuted, marginRight: 4 }}>RANGE:</span>
        {[30, 60, 120, 300].map((s) => (
          <button key={s} onClick={() => setTimeRange(s)} style={{
            background: timeRange === s ? COLORS.blue + "22" : "transparent",
            border: `1px solid ${timeRange === s ? COLORS.blue + "55" : border}`,
            color: timeRange === s ? COLORS.blue : textMuted,
            borderRadius: 4, padding: "2px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
          }}>
            {s < 60 ? `${s}s` : `${s / 60}m`}
          </button>
        ))}
      </div>

      {/* CPU + Memory chart */}
      <div style={card}>
        <div style={{ fontSize: 12, color: textMuted, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>CPU & MEMORY UTILIZATION</span>
          <div style={{ display: "flex", gap: 16 }}>
            {[["CPU", COLORS.blue], ["Memory", COLORS.purple]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 16, height: 2, background: c, display: "inline-block", borderRadius: 1 }} />
                <span>{l}</span>
              </span>
            ))}
          </div>
        </div>
        <TimeSeriesChart
          visibleMetrics={visibleMetrics}
          datasets={[{ key: "cpu", color: COLORS.blue }, { key: "memory", color: COLORS.purple }]}
          yMax={100}
          theme={theme}
        />
      </div>

      {/* Network + Radar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 12, color: textMuted, marginBottom: 8 }}>NETWORK THROUGHPUT</div>
          <NetworkChart visibleMetrics={visibleMetrics} theme={theme} />
        </div>
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, color: textMuted }}>SYSTEM LOAD</div>
          <RadarChart latest={latest} theme={theme} />
        </div>
      </div>

      {/* Heatmap */}
      <div style={card}>
        <div style={{ fontSize: 12, color: textMuted, marginBottom: 8 }}>REQUEST HEATMAP (24h × 7d)</div>
        <HeatmapGrid theme={theme} />
      </div>

      {/* Recent logs */}
      <div style={card}>
        <div style={{ fontSize: 12, color: textMuted, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
          <span>RECENT EVENTS</span>
          <button onClick={() => setActiveTab("logs")} style={{
            background: "transparent", border: "none", color: COLORS.blue, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
          }}>
            VIEW ALL →
          </button>
        </div>
        <ActivityFeed logs={logs} theme={theme} compact />
      </div>
    </div>
  );
}
