import { SparkLine, MiniBar } from "./SparkLine";
import { COLORS } from "../data/constants";

export function MetricCard({
  label,
  value,
  unit,
  color,
  sparkData,
  yMax,
  isBar,
  delta,
  theme,
}) {
  const { textMuted, surface, border } = theme;
  const trendUp = delta && parseFloat(delta) > 0;
  const trendColor =
    label === "Latency"
      ? trendUp
        ? COLORS.red
        : COLORS.teal
      : trendUp
      ? COLORS.teal
      : COLORS.red;

  return (
    <div
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
        {delta && (
          <span
            style={{ fontSize: 11, color: trendColor, fontFamily: "monospace" }}
          >
            {delta}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 600,
            color,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
          }}
        >
          {typeof value === "number"
            ? value.toFixed(label === "Network" || label === "Disk I/O" ? 0 : 1)
            : value}
        </span>
        <span style={{ fontSize: 13, color: textMuted }}>{unit}</span>
      </div>

      <div style={{ marginTop: 2 }}>
        {isBar ? (
          <MiniBar
            data={sparkData}
            color={color}
            width={160}
            height={36}
            yMax={yMax}
          />
        ) : (
          <SparkLine
            data={sparkData}
            color={color}
            width={160}
            height={36}
            fill
            yMin={0}
            yMax={yMax}
          />
        )}
      </div>
    </div>
  );
}
