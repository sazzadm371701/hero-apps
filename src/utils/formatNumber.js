// Shared number formatter used across pages/components
export function formatNumber(n) {
  if (n == null) return "";
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  if (num >= 1_000_000) {
    let v = (num / 1_000_000).toFixed(1);
    if (v.endsWith(".0")) v = v.slice(0, -2);
    return `${v}M`;
  }
  if (num >= 1_000) {
    let v = (num / 1_000).toFixed(1);
    if (v.endsWith(".0")) v = v.slice(0, -2);
    return `${v}K`;
  }
  return String(num);
}
