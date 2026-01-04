/* Cubence API 调用函数 */
(function (root) {
  "use strict";

  const BASE_URL = "https://cubence.com/api/v1";

  // 通用请求函数
  async function request(endpoint, token) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "Cookie": `token=${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // 获取订阅列表
  async function fetchSubscriptions(token, page = 1, pageSize = 10) {
    const endpoint = `/subscription/list?page=${page}&page_size=${pageSize}&status=active`;
    return await request(endpoint, token);
  }

  // 获取仪表盘概览（包含订阅限制信息）
  async function fetchDashboardOverview(token) {
    const endpoint = `/dashboard/overview`;
    const result = await request(endpoint, token);
    return result.data || result;
  }

  // 获取使用日志
  async function fetchUsageLogs(token, startDate, endDate, page = 1, pageSize = 10) {
    const endpoint = `/analytics/apikeys/logs?page=${page}&page_size=${pageSize}&start_date=${startDate}&end_date=${endDate}`;
    const result = await request(endpoint, token);
    return result.data || result;
  }

  // 邮箱登录
  async function emailLogin(email, password) {
    const url = `${BASE_URL}/auth/email-login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
      },
      body: JSON.stringify({ login: email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data;
  }

  root.CubenceApi = {
    fetchSubscriptions,
    fetchDashboardOverview,
    fetchUsageLogs,
    emailLogin,
  };
})(typeof self !== "undefined" ? self : this);
