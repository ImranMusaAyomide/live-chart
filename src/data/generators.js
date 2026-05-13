import { SERVICES, SEV_COLORS } from "./constants";

let _id = 0;
export function uid() {
  return ++_id;
}

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export function rand(lo, hi) {
  return Math.random() * (hi - lo) + lo;
}

function weightedSev() {
  const r = Math.random();
  if (r < 0.55) return "INFO";
  if (r < 0.80) return "WARN";
  if (r < 0.95) return "ERROR";
  return "CRITICAL";
}

export function genMetricPoint(prev = {}) {
  return {
    id: uid(),
    ts: Date.now(),
    cpu: clamp((prev.cpu ?? 45) + rand(-8, 8), 5, 98),
    memory: clamp((prev.memory ?? 60) + rand(-5, 5), 20, 95),
    network: clamp((prev.network ?? 300) + rand(-80, 80), 10, 1000),
    disk: clamp((prev.disk ?? 120) + rand(-30, 30), 5, 500),
    gpu: clamp((prev.gpu ?? 30) + rand(-10, 10), 0, 100),
    latency: clamp((prev.latency ?? 45) + rand(-15, 15), 2, 300),
  };
}

export function genLogEntry() {
  const svc = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const sev = weightedSev();
  const msgs = {
    INFO: [
      `${svc} health check passed`,
      `Request processed in ${rand(10, 80).toFixed(0)}ms`,
      `Cache hit ratio: ${rand(70, 99).toFixed(0)}%`,
    ],
    WARN: [
      `${svc} memory approaching threshold (${rand(75, 89).toFixed(0)}%)`,
      `Slow query detected: ${rand(200, 800).toFixed(0)}ms`,
      `Retry #${rand(1, 3).toFixed(0)} for upstream call`,
    ],
    ERROR: [
      `${svc} connection timeout after ${rand(3, 30).toFixed(0)}s`,
      `Unhandled exception in ${svc}`,
      `Failed to process payload: invalid schema`,
    ],
    CRITICAL: [
      `${svc} is DOWN — circuit breaker tripped`,
      `Database replication lag: ${rand(2, 10).toFixed(0)}s`,
      `Memory OOM kill on ${svc}`,
    ],
  };
  const list = msgs[sev];
  return {
    id: uid(),
    ts: Date.now(),
    service: svc,
    severity: sev,
    message: list[Math.floor(Math.random() * list.length)],
  };
}

export function genTrade() {
  const symbols = ["BTC/USD", "ETH/USD", "SOL/USD", "AVAX/USD", "BNB/USD"];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  const bases = {
    "BTC/USD": 67000,
    "ETH/USD": 3400,
    "SOL/USD": 180,
    "AVAX/USD": 38,
    "BNB/USD": 580,
  };
  const base = bases[sym];
  const price = +(base + rand(-base * 0.02, base * 0.02)).toFixed(2);
  const side = Math.random() > 0.5 ? "BUY" : "SELL";
  return {
    id: uid(),
    ts: Date.now(),
    symbol: sym,
    price,
    side,
    volume: +rand(0.01, 5).toFixed(3),
  };
}

export function genInitialMetrics(count = 40) {
  const points = [];
  let prev = {};
  for (let i = 0; i < count; i++) {
    prev = genMetricPoint(prev);
    points.push(prev);
  }
  return points;
}
