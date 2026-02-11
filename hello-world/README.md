# Claude Agent SDK Hello World

一个简单的示例，演示如何使用 Claude Agent SDK 创建可以与 Claude 交互的自主智能体。

## 概述

Claude Agent SDK 允许您以编程方式使用 Claude 的能力构建 AI 智能体。SDK 将 Claude Code 进程作为子进程生成，并与其通信以自主执行任务。

## 安装

```bash
npm install @anthropic-ai/claude-agent-sdk typescript @types/node tsx zod
```

## 设置

1. 将您的 Anthropic API 密钥设置为环境变量：
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

2. 创建所需的目录结构：
```bash
mkdir -p agent/custom_scripts
```

`agent` 目录用作 Claude 智能体的工作目录，`custom_scripts` 是必须写入 JavaScript/TypeScript 文件的位置（由示例中的钩子强制执行）。

## 工作原理

### 基本结构

SDK 使用一个 `query()` 函数，它返回一个消息的异步可迭代对象：

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

const q = query({
  prompt: 'Your prompt here',
  options: { /* configuration */ }
});

for await (const message of q) {
  // Process messages
}
```

### 关键组件

#### 1. 查询选项

- **`maxTurns`**：最大对话轮数（默认：100）
- **`cwd`**：智能体的工作目录（必须存在）
- **`model`**：要使用的 Claude 模型（`"sonnet"`、`"opus"`、`"haiku"` 或 `"inherit"`）
- **`executable`**：Node.js 二进制文件的路径（使用 `process.execPath` 表示当前运行时）
- **`allowedTools`**：智能体可以使用的工具名称数组

#### 2. 可用工具

智能体可以使用各种工具，包括：
- **文件操作**：`Read`、`Write`、`Edit`、`MultiEdit`、`NotebookEdit`
- **搜索**：`Glob`、`Grep`、`WebSearch`
- **执行**：`Bash`、`Task`
- **实用工具**：`TodoWrite`、`WebFetch`、`BashOutput`、`KillBash`
- **规划**：`ExitPlanMode`

#### 3. 钩子

钩子允许您拦截和控制工具使用。示例中包含一个 `PreToolUse` 钩子，强制 `.js` 和 `.ts` 文件只能写入 `custom_scripts` 目录：

```typescript
hooks: {
  PreToolUse: [
    {
      matcher: "Write|Edit|MultiEdit",
      hooks: [
        async (input: any): Promise<HookJSONOutput> => {
          // Validation logic
          // Return { continue: true } to allow
          // Return { decision: 'block', stopReason: '...', continue: false } to deny
        }
      ]
    }
  ]
}
```

#### 4. 消息类型

SDK 返回三种类型的消息：

- **`system`**：系统级消息和提示
- **`assistant`**：Claude 的响应（包含实际的消息内容）
- **`result`**：工具执行结果

提取 Claude 的文本响应：

```typescript
if (message.type === 'assistant' && message.message) {
  const textContent = message.message.content.find((c: any) => c.type === 'text');
  if (textContent && 'text' in textContent) {
    console.log(textContent.text);
  }
}
```

### 架构

1. SDK 将 Claude Code CLI 进程作为子进程生成
2. 它使用 `executable` 中指定的 Node.js 二进制文件（默认为 `"node"`）
3. 通过子进程的 stdin/stdout 进行通信
4. 智能体在指定的 `cwd` 目录中运行
5. 钩子可以在执行之前拦截和修改工具调用

## 运行示例

```bash
npx tsx hello-world.ts
```

## 常见问题

### "Failed to spawn Claude Code process: spawn node ENOENT"

**解决方案**：将 `executable` 选项设置为 `node`：

```typescript
options: {
  executable: "node",
  // ... other options
}
```

### 生成时出现 "ENOENT" 错误

**解决方案**：确保 `cwd` 目录存在：

```bash
mkdir -p agent
```

### 文件操作的权限错误

**解决方案**：检查您的钩子配置，并确保智能体具有必要的 `allowedTools`。

## 资源

- [Claude Agent SDK 文档](https://docs.claude.com/en/api/agent-sdk/overview)
- [GitHub 仓库](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Anthropic 工程博客](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
# claude-agent-hello-world
