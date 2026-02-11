# Claude Agent SDK 演示项目

> ⚠️ **重要提示**：这些是 Anthropic 提供的演示应用程序。它们仅用于本地开发，不应部署到生产环境或大规模使用。

本仓库包含多个 [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) 的演示项目，展示了使用 Claude 构建 AI 驱动应用程序的不同方式。

## 可用演示

### 📧 [Email Agent](./email-agent)
一个开发中的 IMAP 邮件助手，可以：
- 显示您的收件箱
- 执行智能搜索以查找邮件
- 提供 AI 驱动的邮件协助

### 📊 [Excel Demo](./excel-demo)
使用 Claude 处理电子表格和 Excel 文件的演示。

### 👋 [Hello World](./hello-world)
一个简单的入门示例，帮助您了解 Claude Agent SDK 的基础知识。

### 🔬 [Research Agent](./research-agent)
一个多智能体研究系统，协调专门的子智能体来研究主题并生成全面的报告：
- 将研究请求分解为子主题
- 生成并行的研究者智能体来搜索网络
- 将发现综合成详细的报告
- 演示详细的子智能体活动跟踪

## 快速开始

每个演示都有自己的目录和专门的设置说明。导航到特定的演示文件夹并按照其 README 进行设置和使用。


## 前置要求

- [Bun](https://bun.sh) 运行时（或 Node.js 18+）
- Anthropic API 密钥（[在此获取](https://console.anthropic.com)）

## 入门指南

1. **克隆仓库**
```bash
git clone https://github.com/anthropics/claude-agent-sdk-demos.git
cd claude-agent-sdk-demos
```

2. **选择一个演示并导航到其目录**
```bash
cd email-agent  # 或 excel-demo，或 hello-world
```

3. **按照特定演示的 README** 进行设置和使用

## 资源

- [Claude Agent SDK 文档](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview)
- [API 参考](https://docs.anthropic.com/claude)
- [GitHub Issues](https://github.com/anthropics/claude-agent-sdk-demos/issues)

## 支持

这些演示应用程序按原样提供。对于以下相关问题：
- **Claude Agent SDK**：[SDK 文档](https://docs.anthropic.com/claude-code)
- **演示问题**：[GitHub Issues](https://github.com/anthropics/sdk-demos/issues)
- **API 问题**：[Anthropic 支持](https://support.anthropic.com)

## 许可证

MIT - 这是用于演示目的的示例代码。
