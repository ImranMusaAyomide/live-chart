import { useState, useMemo } from "react";
import { SEV_COLORS } from "../data/constants";
import { fmtMs } from "../utils/format";

export function ActivityFeed({ logs, theme, compact = false }) {
  const { surface, border, text, textMuted } = theme;
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(
    () => (filter === "ALL" ? logs : logs.filter((l) => l.severity === filter)),
    [logs, filter]
  );

  if (compact) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {logs.slice(0, 8).map((log) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 0",
              borderBottom: `1px solid ${border}`,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 10, color: textMuted, whiteSpace: "nowrap", marginTop: 1 }}>
              {fmtMs(log.ts)}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: SEV_COLORS[log.severity],
                minWidth: 52,
                textAlign: "center",
              }}
            >
              {log.severity}
            </span>
            <span style={{ fontSize: 11, color: textMuted, minWidth: 80 }}>{log.service}</span>
            <span style={{ fontSize: 11, color: text }}>{log.message}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filter bar */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: textMuted }}>SEVERITY:</span>
        {["ALL", "INFO", "WARN", "ERROR", "CRITICAL"].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            style={{
              background:
                filter === sev
                  ? (SEV_COLORS[sev] ?? "#378ADD") + "22"
                  : "transparent",
              border: `1px solid ${
                filter === sev
                  ? (SEV_COLORS[sev] ?? "#378ADD") + "66"
                  : border
              }`,
              color: filter === sev ? SEV_COLORS[sev] ?? "#378ADD" : textMuted,
              borderRadius: 4,
              padding: "2px 10px",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {sev}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: textMuted }}>
          {filtered.length} events
        </span>
      </div>

      {/* Log table */}
      <div
        style={{
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead style={{ position: "sticky", top: 0, background: surface, zIndex: 2 }}>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["TIMESTAMP", "SEVERITY", "SERVICE", "MESSAGE"].map((h) => (
                  <th
                    key={h}
                    style={{
                      color: textMuted,
                      fontWeight: 500,
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: 10,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((log) => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td
                    style={{
                      padding: "5px 12px",
                      color: textMuted,
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtMs(log.ts)}
                  </td>
                  <td style={{ padding: "5px 12px" }}>
                    <span
                      style={{
                        background: SEV_COLORS[log.severity] + "20",
                        color: SEV_COLORS[log.severity],
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td style={{ padding: "5px 12px", color: textMuted }}>{log.service}</td>
                  <td style={{ padding: "5px 12px", color: text }}>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
