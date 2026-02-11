# Excel 演示

> ⚠️ **重要提示**：这是 Anthropic 提供的演示应用程序。它仅用于本地开发，不应部署到生产环境或大规模使用。

由 Claude 和 [Claude Agent SDK](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview) 驱动的演示桌面应用程序，展示 AI 驱动的电子表格创建、分析和操作功能。

## 此演示展示的内容

这个基于 Electron 的桌面应用程序演示了如何：
- 创建包含公式、格式和多个工作表的复杂 Excel 电子表格
- 分析和操作现有的电子表格数据
- 使用 Claude 协助进行数据组织和电子表格设计
- 使用 Python 脚本生成复杂的电子表格结构
- 将 Claude Agent SDK 与桌面应用程序集成

### 示例用例

`agent/` 文件夹包含 Python 示例，包括：
- **健身追踪器**：带有自动汇总统计和多个工作表的健身日志
- **预算追踪器**：带有公式和数据验证的财务跟踪
- 具有样式、边框和条件格式的自定义电子表格生成

## 前置要求

- [Node.js 18+](https://nodejs.org) 或 [Bun](https://bun.sh)
- Anthropic API 密钥（[在此获取](https://console.anthropic.com)）
- Python 3.9+（用于 Python 智能体示例）
- LibreOffice（可选，用于公式重新计算）

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/anthropics/sdk-demos.git
cd sdk-demos/excel-demo
```

2. 安装依赖项：
```bash
npm install
# 或 bun install
```

3. 配置您的 Anthropic API 密钥：
   - 设置 `ANTHROPIC_API_KEY` 环境变量，或
   - 应用程序将在首次运行时提示您

4. 运行 Electron 应用程序：
```bash
npm start
# 或 bun start
```

## 使用 Python 示例

`agent/` 目录包含演示电子表格生成的 Python 脚本：

### 设置 Python 环境

```bash
cd agent
python -m venv .venv
source .venv/bin/activate  # Windows 上：.venv\Scripts\activate
pip install -r requirements.txt
```

### 运行示例脚本

```bash
# 创建健身追踪器
python create_workout_tracker.py

# 创建预算追踪器
python create_budget_tracker.py
```

有关 Excel 智能体设置和功能的更多详细信息，请参见 [agent/README.md](./agent/README.md)。

## 功能

- **AI 驱动的电子表格生成**：让 Claude 根据您的要求创建复杂的电子表格
- **公式管理**：使用 Excel 公式、计算和自动重新计算
- **专业样式**：生成带有标题、颜色、边框和格式的电子表格
- **多工作表工作簿**：创建具有多个相关工作表的工作簿
- **数据分析**：分析现有电子表格并提取洞察
- **桌面集成**：使用 Electron 构建的原生桌面应用程序

## 项目结构

```
excel-demo/
├── agent/              # Python 示例和 Excel 智能体设置
│   ├── create_workout_tracker.py
│   ├── create_budget_tracker.py
│   └── README.md       # Excel 智能体文档
├── src/
│   ├── main/          # Electron 主进程
│   └── renderer/      # React UI 组件
└── package.json
```

## 资源

- [Claude Agent SDK 文档](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview)
- [Electron 文档](https://www.electronjs.org/docs/latest/)
- [openpyxl 文档](https://openpyxl.readthedocs.io/)（使用的 Python 库）

## 支持

这是一个按原样提供的演示应用程序。对于以下相关问题：
- **Claude Agent SDK**：[SDK 文档](https://docs.anthropic.com/claude-code)
- **演示问题**：[GitHub Issues](https://github.com/anthropics/sdk-demos/issues)
- **API 问题**：[Anthropic 支持](https://support.anthropic.com)

## 许可证

MIT - 这是用于演示目的的示例代码。

---

由 Anthropic 构建，用于演示 [Claude Agent SDK](https://github.com/anthropics/claude-code-sdk)
