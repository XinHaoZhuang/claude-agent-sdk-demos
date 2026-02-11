# Email Agent 演示

> ⚠️ **重要提示**：这是 Anthropic 提供的演示应用程序。它仅用于本地开发，不应部署到生产环境或大规模使用。

由 Claude 和 Claude Code SDK 驱动的演示邮件客户端，展示 AI 驱动的邮件管理功能。

## 架构

![架构图](./architecture.png)

## 🔒 安全警告

**此应用程序应仅在您的个人机器上本地运行。** 它：
- 以纯文本环境变量存储邮件凭据
- 没有身份验证或多用户支持
- 不符合生产安全标准

## 前置要求

- [Bun](https://bun.sh) 运行时（或 Node.js 18+）
- Anthropic API 密钥（[在此获取](https://console.anthropic.com)）
- 启用 IMAP 访问的邮件账户

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/anthropics/sdk-demos.git
cd sdk-demos/email-agent
```

2. 安装依赖项：
```bash
bun install
# 或 npm install
```

3. 创建环境文件：
```bash
cp .env.example .env
```

4. 在 `.env` 中配置您的凭据（参见下面的 IMAP 设置）

5. 运行应用程序：
```bash
bun run dev
# 或 npm run dev
```

6. 在浏览器中打开 `http://localhost:3000`

## IMAP 设置指南

### Gmail 设置

Gmail 需要使用**应用专用密码**而不是您的常规密码：

1. **启用两步验证**（应用专用密码必需）：
   - 转到 [Google 账户安全](https://myaccount.google.com/security)
   - 点击"两步验证"并按照设置步骤操作

2. **生成应用专用密码**：
   - 转到 [Google 应用专用密码](https://myaccount.google.com/apppasswords)
   - 从下拉菜单中选择"邮件"
   - 选择您的设备（或选择"其他"并命名为"Email Agent"）
   - 点击"生成"
   - **复制 16 位密码**（您将无法再次看到它！）

3. **配置 `.env`**：
```env
ANTHROPIC_API_KEY=your-anthropic-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password  # 不是您的常规密码！
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

## 支持

这是一个按原样提供的演示应用程序。对于以下相关问题：
- **Claude Code SDK**：[SDK 文档](https://docs.anthropic.com/claude-code)
- **演示问题**：[GitHub Issues](https://github.com/anthropics/sdk-demos/issues)
- **API 问题**：[Anthropic 支持](https://support.anthropic.com)

## 许可证

MIT 许可证 - 这是用于演示目的的示例代码。

---

由 Anthropic 构建，用于演示 [Claude Code SDK](https://github.com/anthropics/claude-code-sdk)