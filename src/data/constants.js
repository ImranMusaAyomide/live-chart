export const COLORS = {
  blue: "#378ADD",
  blueLight: "#B5D4F4",
  blueDark: "#185FA5",
  teal: "#1D9E75",
  tealLight: "#9FE1CB",
  tealDark: "#0F6E56",
  amber: "#BA7517",
  amberLight: "#FAC775",
  amberDark: "#854F0B",
  red: "#E24B4A",
  redLight: "#F7C1C1",
  redDark: "#A32D2D",
  green: "#639922",
  greenLight: "#C0DD97",
  greenDark: "#3B6D11",
  purple: "#7F77DD",
  purpleLight: "#CECBF6",
  purpleDark: "#534AB7",
  coral: "#D85A30",
  coralLight: "#F5C4B3",
  coralDark: "#993C1D",
  gray: "#888780",
  grayLight: "#D3D1C7",
  grayDark: "#5F5E5A",
};

export const SERVICES = [
  "api-gateway",
  "auth-service",
  "db-primary",
  "cache",
  "worker",
  "cdn",
];

export const SEVERITY = ["INFO", "WARN", "ERROR", "CRITICAL"];

export const SEV_COLORS = {
  INFO: COLORS.teal,
  WARN: COLORS.amber,
  ERROR: COLORS.red,
  CRITICAL: COLORS.coral,
};

export const MAX_HISTORY = 120;
export const STREAM_INTERVAL = 800;
