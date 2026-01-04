/* Cubence 后台服务脚本 */
importScripts("../shared/utils.js", "../shared/api.js");

const TOKEN_KEY = "cubenceToken";
const BADGE_ALARM = "cubence-badge-refresh";
const BADGE_PERIOD_MINUTES = 5;

// 扩展安装时
chrome.runtime.onInstalled.addListener(() => {
  ensureAlarm();
  refreshBadgeFromApi();
});

// 浏览器启动时
chrome.runtime.onStartup.addListener(() => {
  ensureAlarm();
  refreshBadgeFromApi();
});

// 定时刷新
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === BADGE_ALARM) {
    refreshBadgeFromApi();
  }
});

// Token 变更时
chrome.storage.onChanged.addListener((changes) => {
  if (changes[TOKEN_KEY]) {
    refreshBadgeFromApi();
  }
});

// 响应弹窗消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "refreshBadge") {
    refreshBadgeFromApi();
    sendResponse({ success: true });
  }
  return true;
});

// 确保定时器存在
function ensureAlarm() {
  chrome.alarms.create(BADGE_ALARM, {
    periodInMinutes: BADGE_PERIOD_MINUTES,
  });
}

// 从 storage 获取 Token
async function getTokenFromStorage() {
  try {
    const result = await chrome.storage.local.get(TOKEN_KEY);
    return result[TOKEN_KEY] || "";
  } catch (err) {
    console.error("获取 Token 失败:", err);
    return "";
  }
}

// 从 API 刷新 Badge
async function refreshBadgeFromApi() {
  const token = await getTokenFromStorage();
  if (!token) {
    applyBadge({ text: "--", color: "#9ca3af", title: "未设置 Token" });
    return;
  }

  try {
    // 获取仪表盘概览数据
    const overview = await CubenceApi.fetchDashboardOverview(token);
    const subscriptionLimits = overview.subscription_limits;

    if (!subscriptionLimits || !subscriptionLimits.weekly) {
      applyBadge({ text: "--", color: "#9ca3af", title: "无订阅信息" });
      return;
    }

    const weekly = subscriptionLimits.weekly;
    const weeklyLimit = CubenceUtils.costToUsd(weekly.limit || 0);
    const remaining = CubenceUtils.costToUsd(weekly.remaining || 0);
    const used = CubenceUtils.costToUsd(weekly.used || 0);

    // 计算剩余百分比
    const remainingPercent = weeklyLimit > 0 ? (remaining / weeklyLimit) * 100 : 0;

    const badgeText = CubenceUtils.formatBadgeValue(remaining);
    const color = getBadgeColorByRemaining(remainingPercent);
    applyBadge({
      text: badgeText,
      color,
      title: `1周剩余 ${CubenceUtils.formatUsd(remaining)} / ${CubenceUtils.formatUsd(weeklyLimit)}\n已使用 ${CubenceUtils.formatUsd(used)}`
    });
  } catch (err) {
    applyBadge({
      text: "ERR",
      color: "#ef4444",
      title: "拉取失败：" + (err?.message || err)
    });
  }
}

// 根据剩余百分比获取 Badge 颜色
function getBadgeColorByRemaining(percent) {
  if (!Number.isFinite(percent)) return "#9ca3af";
  if (percent > 50) return "#22c55e";   // 绿色（剩余 > 50%）
  if (percent > 20) return "#f59e0b";   // 橙色（剩余 20%-50%）
  return "#ef4444";                      // 红色（剩余 < 20%）
}

// 应用 Badge
function applyBadge({ text, color, title }) {
  chrome.action.setBadgeText({ text: text || "" });
  chrome.action.setBadgeBackgroundColor({ color: color || "#6b7280" });
  if (title) {
    chrome.action.setTitle({ title });
  }
}
