/* Cubence 工具函数 */
(function (root) {
  "use strict";

  // 获取今天的时间范围（最近30天）
  function getDateRange() {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    return { startDate, endDate };
  }

  // 获取最近7天的时间范围
  function getWeeklyRange() {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    return { startDate, endDate };
  }

  // 格式化时间戳
  function formatTime(dateStr) {
    if (!dateStr) return "--";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}-${day} ${hour}:${minute}`;
  }

  // 将 cost 转换为美元（cost / 1000000 = USD）
  function costToUsd(cost) {
    const num = Number(cost);
    if (!Number.isFinite(num)) return 0;
    return num / 1000000;
  }

  // 格式化美元金额
  function formatUsd(amount) {
    if (!Number.isFinite(amount)) return "$0.00";
    if (amount >= 1000) return "$" + amount.toFixed(0);
    if (amount >= 100) return "$" + amount.toFixed(1);
    if (amount >= 10) return "$" + amount.toFixed(2);
    if (amount >= 1) return "$" + amount.toFixed(2);
    return "$" + amount.toFixed(3);
  }

  // Badge 数字格式化
  function formatBadgeValue(amount) {
    if (!Number.isFinite(amount) || amount <= 0) return "--";
    if (amount >= 1000) return "999+";
    if (amount >= 10) return amount.toFixed(0);
    if (amount >= 1) return amount.toFixed(1);
    if (amount >= 0.1) return amount.toFixed(2);
    return amount.toFixed(3);
  }

  // 计算使用百分比
  function calculateUsagePercent(used, limit) {
    if (!limit || limit <= 0) return 0;
    return Math.min(100, (used / limit) * 100);
  }

  // 格式化百分比
  function formatPercent(percent) {
    if (!Number.isFinite(percent)) return "0%";
    return percent.toFixed(1) + "%";
  }

  // 计算时间进度百分比（从上次重置到现在）
  function calculateTimeProgress(resetsAt, periodMs) {
    if (!resetsAt || !periodMs) return 0;
    const now = Date.now();
    const resetTime = resetsAt * 1000; // 转换为毫秒
    const lastResetTime = resetTime - periodMs;
    const elapsed = now - lastResetTime;
    const percent = (elapsed / periodMs) * 100;
    return Math.min(100, Math.max(0, percent));
  }

  root.CubenceUtils = {
    getDateRange,
    getWeeklyRange,
    formatTime,
    costToUsd,
    formatUsd,
    formatBadgeValue,
    calculateUsagePercent,
    formatPercent,
    calculateTimeProgress,
  };
})(typeof self !== "undefined" ? self : this);
