export function SparkLine({
  data,
  color,
  width = 200,
  height = 50,
  fill = false,
  yMin,
  yMax,
}) {
  if (!data || data.length < 2) return null;
  const lo = yMin ?? Math.min(...data);
  const hi = yMax ?? Math.max(...data);
  const range = hi - lo || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - lo) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M 0,${height} L ${pts.join(" L ")} L ${width},${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {fill && <path d={areaD} fill={color} fillOpacity={0.15} />}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MiniBar({ data, color, width = 200, height = 50, yMax }) {
  if (!data || !data.length) return null;
  const hi = yMax ?? Math.max(...data, 1);
  const bw = width / data.length - 2;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {data.map((v, i) => {
        const bh = Math.max(2, (v / hi) * (height - 2));
        return (
          <rect
            key={i}
            x={i * (bw + 2)}
            y={height - bh}
            width={bw}
            height={bh}
            rx={2}
            fill={color}
            fillOpacity={0.85}
          />
        );
      })}
    </svg>
  );
}
