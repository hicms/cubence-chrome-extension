/* Cubence 弹窗脚本 */
(function () {
  "use strict";

  const TOKEN_KEY = "cubenceToken";
  let currentToken = "";

  // DOM 元素
  const elements = {
    refreshBtn: document.getElementById("refreshBtn"),
    openTokenBtn: document.getElementById("openTokenBtn"),
    closeTokenBtn: document.getElementById("closeTokenBtn"),
    saveTokenBtn: document.getElementById("saveTokenBtn"),
    cancelTokenBtn: document.getElementById("cancelTokenBtn"),
    tokenModal: document.getElementById("tokenModal"),
    tokenInput: document.getElementById("tokenInput"),
    fetchTokenBtn: document.getElementById("fetchTokenBtn"),
    cancelBrowserBtn: document.getElementById("cancelBrowserBtn"),
    browserTab: document.getElementById("browserTab"),
    tokenTab: document.getElementById("tokenTab"),
    authTabs: document.querySelectorAll(".auth-tab"),
    updateAt: document.getElementById("updateAt"),
    subscriptionInfo: document.getElementById("subscriptionInfo"),
    statGrid: document.getElementById("statGrid"),
    logList: document.getElementById("logList"),
    messageBox: document.getElementById("messageBox"),
  };

  // 初始化
  async function init() {
    await initToken();
    setupEventListeners();
    if (currentToken) {
      await loadData();
    } else {
      showMessage("请先设置 Token");
    }
  }

  // 从 storage 读取 Token
  async function initToken() {
    try {
      const result = await chrome.storage.local.get(TOKEN_KEY);
      currentToken = result[TOKEN_KEY] || "";
    } catch (err) {
      console.error("读取 Token 失败:", err);
    }
  }

  // 设置事件监听器
  function setupEventListeners() {
    elements.refreshBtn.addEventListener("click", handleRefresh);
    elements.openTokenBtn.addEventListener("click", openTokenModal);
    elements.closeTokenBtn.addEventListener("click", closeTokenModal);
    elements.saveTokenBtn.addEventListener("click", saveToken);
    elements.cancelTokenBtn.addEventListener("click", closeTokenModal);
    elements.fetchTokenBtn.addEventListener("click", fetchTokenFromBrowser);
    elements.cancelBrowserBtn.addEventListener("click", closeTokenModal);
    elements.authTabs.forEach(tab => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });
  }

  // 切换标签页
  function switchTab(tabName) {
    elements.authTabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    elements.browserTab.classList.toggle("hidden", tabName !== "browser");
    elements.tokenTab.classList.toggle("hidden", tabName !== "token");
  }

  // 从浏览器 Cookie 获取 Token
  async function fetchTokenFromBrowser() {
    try {
      elements.fetchTokenBtn.disabled = true;
      elements.fetchTokenBtn.textContent = "获取中...";

      const cookie = await chrome.cookies.get({
        url: "https://cubence.com",
        name: "token"
      });

      if (cookie && cookie.value) {
        await chrome.storage.local.set({ [TOKEN_KEY]: cookie.value });
        currentToken = cookie.value;
        closeTokenModal();
        showMessage("Token 获取成功");
        await loadData();
      } else {
        showMessage("未找到 Token，请先在 cubence.com 登录");
      }
    } catch (err) {
      showMessage("获取失败: " + err.message);
    } finally {
      elements.fetchTokenBtn.disabled = false;
      elements.fetchTokenBtn.textContent = "获取 Token";
    }
  }

  // 处理刷新
  async function handleRefresh() {
    if (!currentToken) {
      showMessage("请先设置 Token");
      return;
    }
    await loadData(true);
  }

  // 打开 Token 模态框
  function openTokenModal() {
    elements.tokenInput.value = currentToken;
    elements.tokenModal.classList.remove("hidden");
  }

  // 关闭 Token 模态框
  function closeTokenModal() {
    elements.tokenModal.classList.add("hidden");
  }

  // 保存 Token
  async function saveToken() {
    const token = elements.tokenInput.value.trim();
    if (!token) {
      showMessage("Token 不能为空");
      return;
    }

    try {
      await chrome.storage.local.set({ [TOKEN_KEY]: token });
      currentToken = token;
      closeTokenModal();
      showMessage("Token 保存成功");
      await loadData();
    } catch (err) {
      showMessage("保存失败: " + err.message);
    }
  }

  // 显示消息
  function showMessage(msg) {
    elements.messageBox.textContent = msg;
    elements.messageBox.classList.add("show");
    setTimeout(() => {
      elements.messageBox.classList.remove("show");
    }, 2000);
  }

  // 渲染订阅信息
  function renderSubscription(overview) {
    const subscriptionLimits = overview.subscription_limits;
    if (!subscriptionLimits) {
      elements.subscriptionInfo.innerHTML = '<div style="color: var(--muted); text-align: center; padding: 20px;">暂无订阅信息</div>';
      return;
    }

    const fiveHour = subscriptionLimits.five_hour || {};
    const weekly = subscriptionLimits.weekly || {};

    const fiveHourLimit = CubenceUtils.costToUsd(fiveHour.limit || 0);
    const fiveHourRemaining = CubenceUtils.costToUsd(fiveHour.remaining || 0);
    const fiveHourUsed = CubenceUtils.costToUsd(fiveHour.used || 0);

    const weeklyLimit = CubenceUtils.costToUsd(weekly.limit || 0);
    const weeklyRemaining = CubenceUtils.costToUsd(weekly.remaining || 0);
    const weeklyUsed = CubenceUtils.costToUsd(weekly.used || 0);

    const weeklyResetTime = weekly.resets_at ? CubenceUtils.formatTime(new Date(weekly.resets_at * 1000).toISOString()) : '--';

    // 计算使用百分比
    const fiveHourPercent = CubenceUtils.calculateUsagePercent(fiveHourUsed, fiveHourLimit);
    const weeklyPercent = CubenceUtils.calculateUsagePercent(weeklyUsed, weeklyLimit);

    // 计算时间进度百分比
    const FIVE_HOUR_MS = 5 * 60 * 60 * 1000; // 5小时
    const WEEKLY_MS = 7 * 24 * 60 * 60 * 1000; // 1周
    const fiveHourTimePercent = fiveHour.resets_at ? CubenceUtils.calculateTimeProgress(fiveHour.resets_at, FIVE_HOUR_MS) : 0;
    const weeklyTimePercent = weekly.resets_at ? CubenceUtils.calculateTimeProgress(weekly.resets_at, WEEKLY_MS) : 0;

    elements.subscriptionInfo.innerHTML = `
      <div class="subscription-card">
        <div class="subscription-header">
          <div class="plan-name">订阅限制</div>
          <div class="status-badge">激活</div>
        </div>
        <div class="subscription-dates">
          1周重置时间: ${weeklyResetTime}
        </div>
        <div class="limit-info-vertical">
          <div class="limit-row">
            <div class="limit-row-header">
              <div class="limit-label">5小时限制</div>
              <div class="limit-value">${CubenceUtils.formatUsd(fiveHourUsed)} / ${CubenceUtils.formatUsd(fiveHourLimit)}</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${fiveHourPercent}%"></div>
              <div class="progress-marker" style="left: ${fiveHourTimePercent}%"></div>
            </div>
            <div class="limit-percent">
              <span class="percent-label">已用:</span> <span class="percent-value">${CubenceUtils.formatPercent(fiveHourPercent)}</span>
              <span class="percent-separator">|</span>
              <span class="percent-label">时间:</span> <span class="percent-value">${CubenceUtils.formatPercent(fiveHourTimePercent)}</span>
            </div>
          </div>
          <div class="limit-row">
            <div class="limit-row-header">
              <div class="limit-label">1周限制</div>
              <div class="limit-value">${CubenceUtils.formatUsd(weeklyUsed)} / ${CubenceUtils.formatUsd(weeklyLimit)}</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${weeklyPercent}%"></div>
              <div class="progress-marker" style="left: ${weeklyTimePercent}%"></div>
            </div>
            <div class="limit-percent">
              <span class="percent-label">已用:</span> <span class="percent-value">${CubenceUtils.formatPercent(weeklyPercent)}</span>
              <span class="percent-separator">|</span>
              <span class="percent-label">时间:</span> <span class="percent-value">${CubenceUtils.formatPercent(weeklyTimePercent)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染使用统计
  function renderUsageStats(logs) {
    if (!logs || logs.length === 0) {
      elements.statGrid.innerHTML = '<div style="color: var(--muted); text-align: center; padding: 20px; grid-column: 1 / -1;">暂无使用数据</div>';
      return;
    }

    // 计算总消耗
    const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
    const totalUsd = CubenceUtils.costToUsd(totalCost);

    // 计算总 tokens
    const totalTokens = logs.reduce((sum, log) => sum + (log.total_tokens || 0), 0);

    elements.statGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">总消耗</div>
        <div class="stat-value">${CubenceUtils.formatUsd(totalUsd)}</div>
        <div class="stat-sub">最近30天</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">请求次数</div>
        <div class="stat-value">${logs.length}</div>
        <div class="stat-sub">最近10条</div>
      </div>
    `;
  }

  // 渲染日志列表
  function renderLogs(logs) {
    if (!logs || logs.length === 0) {
      elements.logList.innerHTML = '<div style="color: var(--muted); text-align: center; padding: 20px;">暂无使用日志</div>';
      return;
    }

    elements.logList.innerHTML = logs.map(log => {
      const cost = CubenceUtils.costToUsd(log.cost || 0);
      const time = CubenceUtils.formatTime(log.created_at);
      const latency = log.latency ? (log.latency / 1000).toFixed(2) + 's' : '--';

      return `
        <div class="log-item">
          <div class="log-header">
            <div>
              <div class="log-model">${log.model || '未知模型'}</div>
              <div class="log-group">${log.group_name || '--'}</div>
            </div>
            <div class="log-cost">${CubenceUtils.formatUsd(cost)}</div>
          </div>
          <div class="log-details">
            <span>输入: ${log.input_tokens || 0}</span>
            <span>输出: ${log.output_tokens || 0}</span>
            <span>总计: ${log.total_tokens || 0}</span>
          </div>
          <div class="log-cache">
            <span>缓存写入: ${log.cache_creation_input_tokens || 0}</span>
            <span>缓存读取: ${log.cache_read_input_tokens || 0}</span>
            <span>耗时: ${latency}</span>
          </div>
          <div class="log-time">${time}</div>
        </div>
      `;
    }).join('');
  }

  // 加载数据
  async function loadData(force = false) {
    try {
      document.body.classList.add("loading");

      const { startDate, endDate } = CubenceUtils.getDateRange();

      // 并行请求仪表盘概览和使用日志
      const [overview, logsData] = await Promise.all([
        CubenceApi.fetchDashboardOverview(currentToken),
        CubenceApi.fetchUsageLogs(currentToken, startDate, endDate, 1, 10),
      ]);

      // 更新时间戳
      const now = new Date();
      elements.updateAt.textContent = CubenceUtils.formatTime(now.toISOString());

      // 渲染数据
      renderSubscription(overview);
      renderLogs(logsData.logs || []);

      // 通知后台刷新 Badge
      chrome.runtime.sendMessage({ type: "refreshBadge" });
    } catch (err) {
      showMessage("加载失败: " + err.message);
      console.error("加载数据失败:", err);
    } finally {
      document.body.classList.remove("loading");
    }
  }

  // 页面加载时初始化
  init();
})();
