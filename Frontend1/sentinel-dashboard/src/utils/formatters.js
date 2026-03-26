/**
 * Utility functions for formatting data across the Sentinel Dashboard.
 */

export const fmt = {
  // Formats numbers as USD Currency
  currency: (value) => {
    if (value === null || value === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits:2
    }).format(value);
  },

  // Formats large numbers (e.g., 1200 -> 1.2k)
  number: (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  },

  // Formats timestamps for the live feed
  time: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
};

/**
 * Returns a hex color code based on the risk score (0-100).
 * Used by StatCards, TransactionRows, and Charts.
 */
export const riskColor = (score) => {
  if (score >= 80) return "#ff3b3b"; // Critical Red
  if (score >= 50) return "#ff9500"; // Warning Orange
  if (score >= 20) return "#ffcc00"; // Caution Yellow
  return "#34c759"; // Safe Green
};