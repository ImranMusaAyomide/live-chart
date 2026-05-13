import { COLORS } from "../data/constants";
import { SparkLine } from "./SparkLine";
import { ServiceBar } from "./Charts";

export function MetricsTab({ visibleMetrics, theme, card }) {
  const { border, text, textMuted } = theme;
  const latest = visibleMetrics[visibleMetrics.length - 1] ?? {};

  const metricDefs = [
    { label: "CPU", key: "cpu", color: COLORS.blue, max: 100, unit: "%" },
    { label: "Memory", key: "memory", color: COLORS.purple, max: 100, unit: "%" },
    { label: "GPU", key: "gpu", color: COLORS.coral, max: 100, unit: "%" },
    { label: "Network", key: "network", color: COLORS.teal, max: 1000, unit: "MB/s" },
    { label: "Disk I/O", key: "disk", color: COLORS.amber, max: 500, unit: "MB/s" },
    { label: "Latency", key: "latency", color: COLORS.red, max: 300, unit: "ms" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {metricDefs.map(({ label, key, color, max, unit }) => (
          <div key={key} style={card}>
            <div style={{
              fontSize: 12, color: textMuted, marginBottom: 6,
              display: "flex", justifyContent: "space-between",
            }}>
              <span>{label}</span>
              <span style={{ color }}>
                {(latest[key] ?? 0).toFixed(1)}{unit}
              </span>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: border, borderRadius: 2, marginBottom: 10 }}>
              <div style={{
                height: 4,
                background: color,
                borderRadius: 2,
                width: `${Math.min(100, ((latest[key] ?? 0) / max) * 100)}%`,
                transition: "width 0.4s ease",
              }} />
            </div>
            <SparkLine
              data={visibleMetrics.map((m) => m[key])}
              color={color}
              width={240}
              height={60}
              fill
              yMin={0}
              yMax={max}
            />
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, color: textMuted, marginBottom: 10 }}>
          SERVICE LATENCY DISTRIBUTION
        </div>
        <ServiceBar theme={theme} />
      </div>
    </div>
  );
}
