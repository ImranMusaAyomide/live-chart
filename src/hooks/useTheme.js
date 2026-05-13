import { useState, useMemo } from "react";

export function useTheme() {
  const [dark, setDark] = useState(true);

  const theme = useMemo(() => ({
    bg: dark ? "#0d1117" : "#f5f5f0",
    surface: dark ? "#161b22" : "#ffffff",
    surface2: dark ? "#1c2128" : "#f0ede6",
    border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
    text: dark ? "#e6edf3" : "#1c1c1a",
    textMuted: dark ? "#7d8590" : "#6b6a65",
    dark,
  }), [dark]);

  const card = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "16px 20px",
  };

  return { theme, card, toggleDark: () => setDark((d) => !d) };
}
