import { useMemo } from "react";
import { COLORS, SERVICES } from "../data/constants";
import { rand, clamp } from "../data/generators";
import { fmtTime } from "../utils/format";

export function TimeSeriesChart({ visibleMetrics, datasets, height = 180, yMax = 100, theme }) {
  const { border, textMuted } = theme;
  const W = 580, H = height, PAD = { t: 8, r: 8, b: 28, l: 42 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const n = visibleMetrics.length;
  if (n < 2) return null;

  const xScale = (i) => PAD.l + (i / (n - 1)) * cw;
  const yScale = (v) => PAD.t + ch - (Math.min(v, yMax) / yMax) * ch;
  const xTicks = [0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 1]
    .filter((v, i, a) => a.indexOf(v) === i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block", overflow: "visible" }}>
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = yScale((pct / 100) * yMax);
        return (
          <g key={pct}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={border} strokeWidth={0.5} />
            <text x={PAD.l - 6} y={y + 4} fontSize={10} fill={textMuted} textAnchor="end">
              {Math.round((pct / 100) * yMax)}
            </text>
          </g>
        );
      })}
      {xTicks.map((i) => (
        <text key={i} x={xScale(i)} y={H - 6} fontSize={10} fill={textMuted} textAnchor="middle">
          {fmtTime(visibleMetrics[i]?.ts ?? Date.now())}
        </text>
      ))}
      {datasets.map(({ key, color }) => {
        const pts = visibleMetrics.map((m, i) => `${xScale(i)},${yScale(m[key] ?? 0)}`).join(" L ");
        const area = `M ${xScale(0)},${yScale(0)} L ${visibleMetrics
          .map((m, i) => `${xScale(i)},${yScale(m[key] ?? 0)}`)
          .join(" L ")} L ${xScale(n - 1)},${yScale(0)} Z`;
        return (
          <g key={key}>
            <path d={`M ${pts}`} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
            <path d={area} fill={color} fillOpacity={0.08} />
          </g>
        );
      })}
    </svg>
  );
}

export function NetworkChart({ visibleMetrics, theme }) {
  const { border, textMuted } = theme;
  const W = 580, H = 140, PAD = { t: 8, r: 8, b: 28, l: 50 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const n = visibleMetrics.length;
  if (n < 2) return null;

  const maxV = Math.max(...visibleMetrics.map((m) => m.network), 100);
  const xScale = (i) => PAD.l + (i / (n - 1)) * cw;
  const yScale = (v) => PAD.t + ch - (v / maxV) * ch;
  const pts = visibleMetrics.map((m, i) => `${xScale(i)},${yScale(m.network)}`).join(" L ");
  const area = `M ${xScale(0)},${H - PAD.b} L ${visibleMetrics
    .map((m, i) => `${xScale(i)},${yScale(m.network)}`)
    .join(" L ")} L ${xScale(n - 1)},${H - PAD.b} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      {[0, 0.5, 1].map((p) => {
        const y = yScale(p * maxV);
        return (
          <g key={p}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={border} strokeWidth={0.5} />
            <text x={PAD.l - 6} y={y + 4} fontSize={10} fill={textMuted} textAnchor="end">
              {Math.round(p * maxV)}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.teal} stopOpacity="0.35" />
          <stop offset="100%" stopColor={COLORS.teal} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#netGrad)" />
      <path d={`M ${pts}`} fill="none" stroke={COLORS.teal} strokeWidth={2} strokeLinejoin="round" />
      <text x={W - PAD.r} y={PAD.t + 10} fontSize={10} fill={textMuted} textAnchor="end">MB/s</text>
    </svg>
  );
}

export function RadarChart({ latest, theme }) {
  const { border, textMuted } = theme;
  const axes = ["CPU", "Mem", "Net", "Disk", "GPU", "Latency"];
  const keys = ["cpu", "memory", "network", "disk", "gpu", "latency"];
  const maxes = [100, 100, 1000, 500, 100, 300];
  const n = axes.length;
  const cx = 110, cy = 110, r = 80;
  const angles = axes.map((_, i) => (i / n) * 2 * Math.PI - Math.PI / 2);
  const vals = keys.map((k, i) => clamp((latest[k] ?? 0) / maxes[i], 0, 1));
  const pts = angles.map((a, i) => ({
    x: cx + Math.cos(a) * r * vals[i],
    y: cy + Math.sin(a) * r * vals[i],
  }));
  const labelPts = angles.map((a) => ({
    x: cx + Math.cos(a) * (r + 18),
    y: cy + Math.sin(a) * (r + 18),
  }));

  return (
    <svg viewBox="0 0 220 220" width={220} height={220} style={{ display: "block" }}>
      {[0.25, 0.5, 0.75, 1].map((ring) => {
        const rpts = angles.map((a) => `${cx + Math.cos(a) * r * ring},${cy + Math.sin(a) * r * ring}`).join(" ");
        return <polygon key={ring} points={rpts} fill="none" stroke={border} strokeWidth={0.5} />;
      })}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke={border} strokeWidth={0.5} />
      ))}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill={COLORS.blue}
        fillOpacity={0.2}
        stroke={COLORS.blue}
        strokeWidth={1.5}
      />
      {axes.map((a, i) => (
        <text key={a} x={labelPts[i].x} y={labelPts[i].y + 4} fontSize={10} fill={textMuted} textAnchor="middle">
          {a}
        </text>
      ))}
    </svg>
  );
}

export function HeatmapGrid({ theme }) {
  const { border, textMuted } = theme;
  const cols = 24, rows = 7;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cellW = 20, cellH = 16, gap = 2;
  const data = useMemo(
    () => Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.random())),
    []
  );
  const W = cols * (cellW + gap) + 40, H = rows * (cellH + gap) + 20;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      {days.map((d, r) => (
        <text key={d} x={0} y={r * (cellH + gap) + cellH / 2 + 14} fontSize={10} fill={textMuted}>{d}</text>
      ))}
      {data.map((row, r) =>
        row.map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * (cellW + gap) + 36}
            y={r * (cellH + gap) + 8}
            width={cellW}
            height={cellH}
            rx={3}
            fill={COLORS.blue}
            fillOpacity={0.05 + v * 0.95}
          />
        ))
      )}
    </svg>
  );
}

export function ServiceBar({ theme }) {
  const { border, textMuted } = theme;
  const svcData = useMemo(
    () => SERVICES.map((s) => ({ name: s, p50: rand(10, 80), p95: rand(80, 200), p99: rand(200, 400) })),
    []
  );
  const W = 580, H = 160, PAD = { t: 8, r: 8, b: 36, l: 100 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;
  const maxV = 400;
  const barH = Math.floor((ch / svcData.length) * 0.55);
  const step = ch / svcData.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
      {[0, 100, 200, 300, 400].map((v) => {
        const x = PAD.l + (v / maxV) * cw;
        return (
          <g key={v}>
            <line x1={x} y1={PAD.t} x2={x} y2={H - PAD.b} stroke={border} strokeWidth={0.5} />
            <text x={x} y={H - PAD.b + 14} fontSize={10} fill={textMuted} textAnchor="middle">{v}ms</text>
          </g>
        );
      })}
      {svcData.map((d, i) => {
        const y = PAD.t + i * step + (step - barH * 2.5) / 2;
        return (
          <g key={d.name}>
            <text x={PAD.l - 8} y={y + barH * 1.5} fontSize={11} fill={textMuted} textAnchor="end">{d.name}</text>
            <rect x={PAD.l} y={y} width={(d.p50 / maxV) * cw} height={barH * 0.8} rx={2} fill={COLORS.teal} fillOpacity={0.9} />
            <rect x={PAD.l} y={y + barH * 0.9} width={(d.p95 / maxV) * cw} height={barH * 0.8} rx={2} fill={COLORS.amber} fillOpacity={0.9} />
            <rect x={PAD.l} y={y + barH * 1.8} width={(d.p99 / maxV) * cw} height={barH * 0.8} rx={2} fill={COLORS.coral} fillOpacity={0.9} />
          </g>
        );
      })}
      {[["p50", COLORS.teal], ["p95", COLORS.amber], ["p99", COLORS.coral]].map(([lbl, col], i) => (
        <g key={lbl}>
          <rect x={PAD.l + i * 60} y={H - 10} width={10} height={8} rx={2} fill={col} />
          <text x={PAD.l + i * 60 + 14} y={H - 3} fontSize={10} fill={textMuted}>{lbl}</text>
        </g>
      ))}
    </svg>
  );
}
