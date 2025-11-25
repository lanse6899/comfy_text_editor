# 🔵BB文本再次编辑

ComfyUI 文本编辑节点 - 在工作流中暂停、编辑文本，支持单独执行和展示预览


<img width="1047" height="676" alt="ScreenShot_2025-11-25_140133_636" src="https://github.com/user-attachments/assets/18033c4e-6b7a-4048-92e1-0c5d71195ad4" />


---

## 安装

1. 将文件夹复制到 `ComfyUI/custom_nodes/` 目录
2. 重启 ComfyUI
3. 在菜单中找到：`🔵BB text editor → 🔵BB文本再次编辑`

---

## 功能特性

### 🎯 核心功能
- ✅ **暂停编辑**：在工作流中暂停，让你编辑文本内容
- ✅ **内容保留**：编辑内容会被保留，不会被覆盖
- ✅ **单独执行**：只执行当前节点和展示节点，不触发后续流程
- ✅ **实时预览**：编辑后立即看到展示效果

### 🔘 按钮功能

| 按钮 | 功能 | 说明 |
|------|------|------|
| **⚡ Execute Node + Display** | 执行节点+展示 | 🆕 执行当前节点和连接的展示节点 |
| **✓ Confirm & Continue** | 确认并继续 | 继续执行整个工作流 |
| **🔄 Load New Input** | 加载新输入 | 清空编辑内容，准备加载新文本 |

## 使用方法

### 基础设置

1. **添加节点**
   - 右键 → 添加节点 → `🔵BB text editor` → `🔵BB文本再次编辑`

2. **连接节点**
   - 将文本输入连接到 `input_text`
   - 将 `output_text` 连接到展示文本节点（可选）

3. **编辑文本**
   - 运行工作流或点击按钮
   - 在 `editable_text` 框中编辑内容

### 执行方式

#### 🆕 快速预览模式
- 点击 `⚡ Execute Node + Display`
- 只执行当前节点和连接的展示节点
- 适合快速预览和调试

#### 完整工作流模式
- 点击 `✓ Confirm & Continue`
- 继续执行整个工作流
- 适合最终确认后的完整处理

---

## 工作流示例

```
[文本输入] → [🔵BB文本编辑器] → [展示文本节点] → [后续处理]
                    ↓                    ↓              ↑
              点击新按钮执行        会被自动执行      不会被执行
```

## 重要提示

⭐ **编辑内容保留** - 多次运行不会覆盖你的编辑内容
💡 **智能执行控制** - 新按钮只执行到展示节点，不触发后续处理
🎯 **快速调试** - 适合文本编辑和展示效果的快速验证
🔄 **灵活切换** - 可以在预览模式和完整模式间自由切换

---

## 更新日志

### v2.0 (2025-11-25)
🆕 **新增功能**
- 添加 `⚡ Execute Node + Display` 按钮
- 支持只执行当前节点和连接的展示节点
- 智能识别展示类型节点
- 增强的用户反馈和通知系统

🔧 **技术改进**
- 优化节点连接分析
- 改进错误处理机制
- 增加详细的控制台日志

### v1.0 (2025-11-01)
🎉 **初始版本**
- 基础文本编辑功能
- 工作流暂停和继续
- 编辑内容保留机制

---

## 许可证 / License

### 中文
- ✅ 个人使用：免费使用
- ✅ 学习研究：免费使用
- ⚠️ **禁止修改**：不可修改源代码
- ⚠️ **商用平台**：商用平台方使用需通知作者
- 📧 联系方式：使用前请联系作者获取授权

**版权所有 © 2025 保留所有权利**

### English
- ✅ Personal use: Free to use
- ✅ Learning & Research: Free to use
- ⚠️ **No Modification**: Source code modification is prohibited
- ⚠️ **Commercial Platform**: Commercial platform providers must notify the author before use
- 📧 Contact: Please contact the author for authorization before use

**Copyright © 2025 All Rights Reserved**
