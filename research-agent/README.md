# 多智能体研究系统

一个多智能体研究系统，协调专门的子智能体来研究任何主题，并生成带有数据可视化的全面 PDF 报告。

## 快速开始

```bash
# 安装依赖项
uv sync

# 设置您的 API 密钥
export ANTHROPIC_API_KEY="your-api-key"

# 运行智能体
uv run python research_agent/agent.py
```

然后询问："研究 2025 年量子计算的发展"

## 工作原理

1. **主智能体**将您的请求分解为 2-4 个子主题
2. 并行生成**研究者**子智能体来搜索网络
3. 每个研究者将发现保存到 `files/research_notes/`
4. 生成**数据分析师**来提取指标并在 `files/charts/` 中生成图表
5. 生成**报告撰写者**在 `files/reports/` 中创建最终的 PDF 报告

## 智能体

| 智能体 | 工具 | 用途 |
|-------|-------|---------|
| **主智能体** | `Task` | 协调研究，委派给子智能体 |
| **研究者** | `WebSearch`、`Write` | 从网络收集信息 |
| **数据分析师** | `Glob`、`Read`、`Bash`、`Write` | 提取指标，生成图表 |
| **报告撰写者** | `Skill`、`Write`、`Glob`、`Read`、`Bash` | 创建带有嵌入式可视化的 PDF 报告 |

## 斜杠命令

| 命令 | 描述 |
|---------|-------------|
| `/research <topic>` | 开始对任何主题的集中研究 |
| `/competitive-analysis <company>` | 分析公司或产品 |
| `/market-trends <industry>` | 研究行业趋势 |
| `/fact-check <claim>` | 验证声明和陈述 |
| `/summarize` | 总结所有当前的研究发现 |

## 示例查询

- "研究量子计算的发展"
- "可再生能源的当前趋势是什么？"
- `/competitive-analysis Tesla`
- `/market-trends artificial intelligence`

## 输出结构

```
files/
├── research_notes/     # 来自研究者的 Markdown 文件
├── data/               # 来自分析师的数据摘要
├── charts/             # PNG 可视化
└── reports/            # 最终 PDF 报告

logs/
└── session_YYYYMMDD_HHMMSS/
    ├── transcript.txt      # 人类可读的对话
    └── tool_calls.jsonl    # 结构化的工具使用日志
```

## 使用钩子进行子智能体跟踪

系统使用 SDK 钩子跟踪所有工具调用。

### 跟踪的内容

- **谁**：哪个智能体（RESEARCHER-1、DATA-ANALYST-1 等）
- **什么**：工具名称（WebSearch、Write、Bash 等）
- **何时**：时间戳
- **输入/输出**：参数和结果

### 工作原理

钩子在执行前后拦截每个工具调用：

```python
hooks = Hooks(
    pre_tool_use=[tracker.pre_tool_use_hook],
    post_tool_use=[tracker.post_tool_use_hook]
)
```

`parent_tool_use_id` 将工具调用链接到其子智能体：
- 主智能体通过 `Task` 工具生成研究者 → 获得 ID "task_123"
- 该研究者的所有工具调用都包含 `parent_tool_use_id = "task_123"`
- 钩子使用此 ID 来识别哪个子智能体进行了调用

### 日志输出

**transcript.txt** - 人类可读：
```
[RESEARCHER-1] → WebSearch
    Input: query='quantum computing 2025'
[DATA-ANALYST-1] → Bash
    Input: python matplotlib chart generation
```

**tool_calls.jsonl** - 结构化 JSON：
```json
{"event":"tool_call_start","agent_id":"RESEARCHER-1","tool_name":"WebSearch",...}
{"event":"tool_call_complete","success":true,"output_size":15234}
```
