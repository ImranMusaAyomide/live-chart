import { useState, useEffect, useRef } from "react";
import {
  genMetricPoint,
  genLogEntry,
  genTrade,
  genInitialMetrics,
} from "../data/generators";
import { MAX_HISTORY, STREAM_INTERVAL } from "../data/constants";

export function useStream() {
  const [streaming, setStreaming] = useState(true);
  const [metrics, setMetrics] = useState(() => genInitialMetrics(40));
  const [logs, setLogs] = useState(() =>
    Array.from({ length: 20 }, genLogEntry).sort((a, b) => b.ts - a.ts)
  );
  const [trades, setTrades] = useState(() =>
    Array.from({ length: 15 }, genTrade).sort((a, b) => b.ts - a.ts)
  );
  const [alerts, setAlerts] = useState([]);
  const [connectionOk, setConnectionOk] = useState(true);
  const streamRef = useRef(null);

  // Main data stream
  useEffect(() => {
    if (!streaming) {
      clearInterval(streamRef.current);
      return;
    }
    streamRef.current = setInterval(() => {
      setMetrics((prev) => {
        const last = prev[prev.length - 1];
        const next = genMetricPoint(last);
        const updated = [...prev, next];
        return updated.length > MAX_HISTORY
          ? updated.slice(-MAX_HISTORY)
          : updated;
      });
      if (Math.random() < 0.6) {
        const entry = genLogEntry();
        setLogs((prev) => [entry, ...prev].slice(0, 200));
        if (entry.severity === "CRITICAL" || entry.severity === "ERROR") {
          setAlerts((prev) =>
            [{ ...entry, read: false }, ...prev].slice(0, 10)
          );
        }
      }
      if (Math.random() < 0.5) {
        setTrades((prev) => [genTrade(), ...prev].slice(0, 100));
      }
    }, STREAM_INTERVAL);

    return () => clearInterval(streamRef.current);
  }, [streaming]);

  // Simulate occasional connection drop
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() < 0.03) {
        setConnectionOk(false);
        setTimeout(() => setConnectionOk(true), 2500);
      }
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const toggleStreaming = () => setStreaming((s) => !s);

  return {
    streaming,
    toggleStreaming,
    metrics,
    logs,
    trades,
    alerts,
    connectionOk,
  };
}
