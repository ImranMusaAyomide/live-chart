import { COLORS } from "../data/constants";
import { SparkLine } from "./SparkLine";
import { fmtMs } from "../utils/format";

export function TradeTable({ trades, theme }) {
  const { surface, border, text, textMuted } = theme;

  const symbols = ["BTC/USD", "ETH/USD", "SOL/USD", "AVAX/USD", "BNB/USD"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Price cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {symbols.map((sym) => {
          const symTrades = trades.filter((t) => t.symbol === sym).slice(0, 20);
          const prices = symTrades.map((t) => t.price);
          const latest = prices[0] ?? 0;
          const prev = prices[prices.length - 1] ?? 0;
          const pct = prev ? ((latest - prev) / prev) * 100 : 0;
          const up = pct >= 0;

          return (
            <div
              key={sym}
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div style={{ fontSize: 11, color: textMuted }}>{sym}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: up ? COLORS.teal : COLORS.red,
                  margin: "4px 0",
                  fontFamily: "monospace",
                }}
              >
                ${latest.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: up ? COLORS.teal : COLORS.red }}>
                {up ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
              </div>
              <SparkLine
                data={prices.slice().reverse()}
                color={up ? COLORS.teal : COLORS.red}
                width={180}
                height={40}
                fill
              />
            </div>
          );
        })}
      </div>

      {/* Trade feed */}
      <div
        style={{
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${border}`,
            fontSize: 12,
            color: textMuted,
          }}
        >
          LIVE TRADE FEED
        </div>
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: surface,
                zIndex: 2,
              }}
            >
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["TIME", "SYMBOL", "SIDE", "PRICE", "VOLUME"].map((h) => (
                  <th
                    key={h}
                    style={{
                      color: textMuted,
                      fontWeight: 500,
                      padding: "6px 12px",
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
              {trades.slice(0, 40).map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td
                    style={{
                      padding: "5px 12px",
                      color: textMuted,
                      fontFamily: "monospace",
                    }}
                  >
                    {fmtMs(t.ts)}
                  </td>
                  <td style={{ padding: "5px 12px", fontWeight: 500, color: text }}>
                    {t.symbol}
                  </td>
                  <td style={{ padding: "5px 12px" }}>
                    <span
                      style={{
                        color: t.side === "BUY" ? COLORS.teal : COLORS.red,
                        fontWeight: 600,
                      }}
                    >
                      {t.side}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "5px 12px",
                      fontFamily: "monospace",
                      color: text,
                    }}
                  >
                    ${t.price.toLocaleString()}
                  </td>
                  <td style={{ padding: "5px 12px", color: textMuted }}>
                    {t.volume}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
