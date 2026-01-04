# Cubence 使用查询 Chrome 扩展

一个轻量级的 Chrome 浏览器扩展，用于实时监控 Cubence API 订阅使用情况和成本。无需登录网站，即可在浏览器工具栏快速查看 API 消耗、速率限制和使用日志。

## 核心功能

### 📊 订阅信息监控
- **速率限制追踪**：显示 5 小时和 7 天的速率限制及剩余额度
- **可视化进度条**：直观展示限制窗口的时间进度和使用比例
- **重置时间提醒**：显示速率限制重置的剩余时间

### 💰 成本统计
- **实时消耗显示**：展示最近 30 天的总消耗金额（USD）
- **智能精度格式化**：根据金额大小自动调整显示精度
- **Badge 提醒**：扩展图标上显示剩余预算，颜色随使用率变化

### 📝 使用日志
- **最近请求记录**：显示最近 10 条 API 请求详情
- **详细指标**：包含模型名称、分组、成本、延迟、Token 消耗
- **缓存统计**：显示缓存创建和读取的 Token 数量

### 🔄 自动更新
- **后台定时刷新**：每 5 分钟自动更新数据
- **手动刷新**：支持点击按钮立即更新
- **Token 变更同步**：修改 Token 后自动刷新数据

## 系统要求

- Chrome 浏览器版本 ≥ 88（支持 Manifest V3）
- 有效的 Cubence 账号和 API Token
- 网络连接到 `https://cubence.com`

## 安装步骤

### 方式一：开发者模式安装（推荐）

1. **下载扩展源码**
   ```bash
   git clone <repository-url>
   cd cubence-chrome-extension
   ```

2. **打开扩展管理页面**
   - 在 Chrome 地址栏输入 `chrome://extensions/`
   - 或通过菜单：`更多工具` → `扩展程序`

3. **启用开发者模式**
   - 点击页面右上角的"开发者模式"开关
   - 开关变为蓝色表示已启用

4. **加载扩展**
   - 点击左上角的"加载已解压的扩展程序"按钮
   - 在文件选择器中，导航到 `cubence-chrome-extension` 文件夹
   - 选择该文件夹并点击"选择"

5. **验证安装**
   - 扩展列表中出现"Cubence 使用查询"卡片
   - 浏览器工具栏显示扩展图标
   - 图标上可能显示"?"（表示未配置 Token）

### 方式二：固定到工具栏（可选）

安装后建议将扩展固定到工具栏以便快速访问：
1. 点击浏览器工具栏右侧的拼图图标（扩展菜单）
2. 找到"Cubence 使用查询"
3. 点击图钉图标将其固定到工具栏

## 配置指南

### 获取 Cubence Token

Token 是访问 Cubence API 的凭证，需要从浏览器 Cookie 中提取：

1. **登录 Cubence**
   - 访问 https://cubence.com
   - 使用你的账号登录

2. **打开开发者工具**
   - Windows/Linux：按 `F12` 或 `Ctrl + Shift + I`
   - macOS：按 `Cmd + Option + I`

3. **查找 Token**
   - 切换到 `Application`（应用）标签
   - 左侧菜单展开 `Storage` → `Cookies`
   - 点击 `https://cubence.com`
   - 在右侧列表中找到名为 `token` 的 Cookie
   - 双击 `Value` 列复制完整的 Token 值

4. **Token 格式示例**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 配置 Token

1. **打开扩展弹窗**
   - 点击浏览器工具栏的扩展图标

2. **进入 Token 设置**
   - 点击弹窗右上角的"Token"按钮
   - 弹出 Token 配置对话框

3. **输入 Token**
   - 将复制的 Token 粘贴到输入框
   - 确保 Token 完整无误（通常很长）

4. **保存配置**
   - 点击"保存"按钮
   - 看到"Token 已保存"提示表示成功
   - 扩展会自动刷新数据

## 使用说明

### 查看订阅信息

点击扩展图标后，弹窗顶部显示订阅限制信息：

- **5 小时速率限制**
  - 显示已用/总限制（如：45 / 100）
  - 进度条展示使用比例和时间进度
  - 显示距离重置的剩余时间

- **7 天速率限制**
  - 同样显示已用/总限制
  - 独立的进度条和重置时间

### 查看使用统计

弹窗中部显示使用概览：

- **总消耗**：最近 30 天的总成本（USD）
- **请求次数**：最近 10 次请求的计数

### 查看使用日志

弹窗底部显示最近 10 条 API 请求记录，每条包含：

- **模型名称**：使用的 AI 模型（如 gpt-4-turbo）
- **分组**：API Key 所属分组
- **成本**：单次请求消耗金额（USD）
- **延迟**：请求响应时间（毫秒）
- **Token 统计**：
  - Input：输入 Token 数
  - Output：输出 Token 数
  - Cache Creation：缓存创建 Token 数
  - Cache Read：缓存读取 Token 数

### 手动刷新数据

- 点击弹窗右上角的"刷新"按钮
- 数据更新时弹窗会短暂变暗
- 更新完成后自动恢复

### Badge 图标说明

扩展图标上的 Badge 显示剩余预算，颜色含义：

- 🟢 **绿色**：剩余 > 50%，使用正常
- 🟠 **橙色**：剩余 20-50%，注意用量
- 🔴 **红色**：剩余 < 20%，接近限制

Badge 数字格式：
- 小于 1000：显示完整数字
- 大于 1000：显示为 "999+"

## 项目结构

```
cubence-chrome-extension/
├── manifest.json              # Chrome 扩展配置（Manifest V3）
├── README.md                  # 项目文档
│
├── popup/                     # 弹窗界面
│   ├── popup.html            # 主界面 HTML
│   └── popup.js              # 界面逻辑和事件处理
│
├── background/                # 后台服务
│   └── background.js         # Service Worker（定时任务、Badge 更新）
│
├── shared/                    # 共享模块
│   ├── api.js                # API 客户端（数据获取）
│   └── utils.js              # 工具函数（格式化、计算）
│
├── styles/                    # 样式文件
│   └── popup.css             # 弹窗样式（蓝色主题）
│
└── icons/                     # 图标资源
    ├── icon-16.png           # 工具栏图标（16x16）
    ├── icon-32.png           # 扩展管理页图标（32x32）
    ├── icon-48.png           # 扩展管理页图标（48x48）
    ├── icon-128.png          # Chrome Web Store 图标（128x128）
    ├── logo.png              # 弹窗 Logo
    ├── logo.svg              # Logo 矢量图
    └── icon-generator.html   # 图标生成工具
```

### 核心文件说明

| 文件 | 功能 | 关键内容 |
|------|------|----------|
| `manifest.json` | 扩展配置 | 权限声明、图标配置、Service Worker 注册 |
| `popup/popup.js` | 界面逻辑 | 数据渲染、用户交互、Token 管理 |
| `background/background.js` | 后台任务 | 定时刷新、Badge 更新、数据缓存 |
| `shared/api.js` | API 调用 | 订阅信息获取、使用日志查询 |
| `shared/utils.js` | 工具函数 | 金额格式化、时间计算、百分比计算 |
| `styles/popup.css` | 界面样式 | 布局、颜色、动画效果 |

## 技术架构

### 技术栈

- **平台**：Chrome Extension Manifest V3
- **前端**：原生 HTML5 + CSS3 + JavaScript（无框架）
- **架构模式**：Service Worker + Popup + Shared Modules
- **存储**：Chrome Storage API（本地存储）
- **网络**：Fetch API + Cookie 认证
- **字体**：Google Fonts - Manrope

### 核心技术实现

#### 1. 数据获取流程

```
用户输入 Token → Chrome Storage → Background Service Worker
                                          ↓
                                    定时任务（5分钟）
                                          ↓
                                    Fetch API 请求
                                          ↓
                              Cubence API（带 Cookie）
                                          ↓
                                    数据处理 + 格式化
                                          ↓
                              Badge 更新 + 数据缓存
                                          ↓
                                    Popup 界面渲染
```

#### 2. Badge 颜色逻辑

```javascript
// 基于剩余预算百分比
const remaining = (limit - used) / limit * 100;

if (remaining > 50) {
  color = '#4CAF50';  // 绿色
} else if (remaining > 20) {
  color = '#FF9800';  // 橙色
} else {
  color = '#F44336';  // 红色
}
```

#### 3. 成本计算

API 返回的成本单位为微美元（1/1,000,000 USD）：

```javascript
// 转换为 USD
const costInUSD = apiCost / 1_000_000;

// 智能精度格式化
if (cost >= 1) return cost.toFixed(2);      // $1.23
if (cost >= 0.01) return cost.toFixed(4);   // $0.0123
return cost.toFixed(6);                      // $0.000123
```

#### 4. 时间进度计算

速率限制窗口的时间进度：

```javascript
const now = Date.now();
const start = resetTime - windowDuration;
const elapsed = now - start;
const progress = (elapsed / windowDuration) * 100;
```

## 开发指南

### 环境准备

无需安装依赖，项目使用原生 JavaScript：

```bash
# 克隆项目
git clone <repository-url>
cd cubence-chrome-extension

# 直接加载到 Chrome 即可开发
```

### 开发调试

1. **修改代码后重新加载**
   - 访问 `chrome://extensions/`
   - 找到"Cubence 使用查询"
   - 点击刷新图标（🔄）

2. **查看 Service Worker 日志**
   - 在扩展卡片上点击"Service Worker"链接
   - 打开 DevTools 查看后台日志

3. **调试弹窗界面**
   - 右键点击扩展图标
   - 选择"检查弹出内容"
   - 打开 DevTools 调试 popup.js

4. **修改刷新间隔**（开发时可缩短）
   ```javascript
   // background/background.js
   chrome.alarms.create('refreshBadge', {
     periodInMinutes: 1  // 改为 1 分钟
   });
   ```

### 代码规范

- 使用 ES6+ 语法（箭头函数、模板字符串、解构等）
- 函数采用 IIFE 模式封装，避免全局污染
- 异步操作使用 async/await
- 错误处理使用 try-catch
- 注释使用中文，代码使用英文

### 自定义配置

#### 修改 API 端点

```javascript
// shared/api.js
const API_BASE = 'https://cubence.com/api/v1';
```

#### 修改刷新间隔

```javascript
// background/background.js
const REFRESH_INTERVAL = 5; // 分钟
```

#### 修改日志数量

```javascript
// shared/api.js
const LOG_LIMIT = 10; // 显示条数
```

## API 文档

### 端点说明

#### 1. 获取订阅概览

```
GET /api/v1/dashboard/overview
```

**认证**：Cookie（token）

**响应示例**：
```json
{
  "subscription": {
    "limits": {
      "fiveHourLimit": 100,
      "fiveHourUsed": 45,
      "fiveHourResetAt": "2026-01-04T15:30:00Z",
      "weeklyLimit": 1000,
      "weeklyUsed": 320,
      "weeklyResetAt": "2026-01-07T00:00:00Z"
    }
  }
}
```

#### 2. 获取使用日志

```
GET /api/v1/analytics/apikeys/logs?limit=10&offset=0
```

**参数**：
- `limit`：返回记录数（默认 10）
- `offset`：分页偏移量（默认 0）

**认证**：Cookie（token）

**响应示例**：
```json
{
  "logs": [
    {
      "model": "gpt-4-turbo",
      "group": "default",
      "cost": 123456,
      "latency": 1234,
      "inputTokens": 100,
      "outputTokens": 200,
      "cacheCreationTokens": 50,
      "cacheReadTokens": 30,
      "createdAt": "2026-01-04T10:30:00Z"
    }
  ],
  "total": 150
}
```

### 数据字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `cost` | number | 成本（微美元，需除以 1,000,000） |
| `latency` | number | 延迟（毫秒） |
| `inputTokens` | number | 输入 Token 数 |
| `outputTokens` | number | 输出 Token 数 |
| `cacheCreationTokens` | number | 缓存创建 Token 数 |
| `cacheReadTokens` | number | 缓存读取 Token 数 |

## 故障排除

### 常见问题

#### 1. 扩展图标显示"?"

**原因**：未配置 Token 或 Token 无效

**解决方案**：
- 点击扩展图标
- 点击"Token"按钮
- 重新输入有效的 Token
- 确保 Token 从 Cubence 网站的 Cookie 中正确复制

#### 2. 显示"获取数据失败"

**可能原因**：
- Token 已过期
- 网络连接问题
- Cubence API 服务异常

**解决方案**：
1. 检查网络连接
2. 重新登录 Cubence 网站获取新 Token
3. 查看浏览器控制台错误信息
4. 检查 Service Worker 日志

#### 3. Badge 不更新

**原因**：后台 Service Worker 未运行

**解决方案**：
- 访问 `chrome://extensions/`
- 找到扩展，点击"Service Worker"
- 查看是否有错误
- 点击扩展刷新按钮重新加载

#### 4. 数据显示不完整

**原因**：API 响应数据格式变化

**解决方案**：
- 打开浏览器控制台查看错误
- 检查 API 响应格式是否与代码匹配
- 更新扩展到最新版本

#### 5. Token 保存后仍无法加载数据

**检查步骤**：
1. 打开 DevTools 控制台
2. 查看是否有 CORS 或网络错误
3. 确认 Token 格式正确（JWT 格式）
4. 尝试在 Cubence 网站重新登录

### 调试技巧

#### 查看 API 请求

1. 打开扩展弹窗
2. 右键选择"检查"
3. 切换到 Network 标签
4. 点击刷新按钮
5. 查看 API 请求和响应

#### 查看存储数据

```javascript
// 在控制台执行
chrome.storage.local.get(['cubenceToken'], (result) => {
  console.log('Token:', result.cubenceToken);
});
```

## 注意事项

### ⚠️ 安全提醒

1. **Token 安全**
   - Token 存储在本地浏览器，不会上传到第三方服务器
   - 不要在公共场合展示包含 Token 的截图
   - 定期更换 Token 以提高安全性

2. **权限说明**
   - `storage`：存储 Token 配置
   - `alarms`：定时刷新任务
   - `host_permissions`：仅访问 `https://cubence.com/*`

3. **数据隐私**
   - 扩展仅读取订阅和使用数据
   - 不收集、不上传任何个人信息
   - 所有数据处理在本地完成

### 📝 使用建议

1. **首次安装后**
   - 立即配置 Token
   - 验证数据显示正常
   - 固定到工具栏方便访问

2. **日常使用**
   - 定期查看 Badge 颜色
   - 接近限制时注意控制用量
   - Token 过期后及时更新

3. **性能优化**
   - 后台刷新间隔已优化为 5 分钟
   - 不影响浏览器性能
   - Service Worker 自动休眠节省资源

## 版本信息

**当前版本**：1.0.0

### 主要特性

- ✅ 订阅限制监控（5 小时 / 7 天）
- ✅ 使用日志查看（最近 10 条）
- ✅ 成本统计（最近 30 天）
- ✅ Badge 提醒（颜色分级）
- ✅ 自动刷新（5 分钟间隔）
- ✅ Token 管理（安全存储）

### 技术特点

- 🚀 原生 JavaScript，无依赖
- 📦 轻量级，加载快速
- 🔒 本地存储，安全可靠
- 🎨 现代化 UI 设计
- ⚡ Manifest V3 标准

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue

- 描述问题或建议
- 提供复现步骤（如果是 Bug）
- 附上截图或错误日志

### 提交 PR

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

### 开发规范

- 遵循现有代码风格
- 添加必要的注释
- 测试功能正常运行
- 更新相关文档

## 许可证

本项目仅供个人学习和使用。

## 致谢

- 字体：Google Fonts - Manrope
- API 服务：Cubence

---

**注意**：本扩展为非官方工具，与 Cubence 官方无关。使用前请确保遵守 Cubence 服务条款。
