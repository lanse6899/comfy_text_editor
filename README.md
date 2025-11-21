# 🔵BB文本再次编辑

<img width="687" height="485" alt="12312" src="https://github.com/user-attachments/assets/d386f3c1-a3c1-4a18-bfcf-026938f60a9e" />

ComfyUI 文本编辑节点 - 在工作流中暂停、编辑文本，点击确认后继续运行

---

## 安装

1. 将文件夹复制到 `ComfyUI/custom_nodes/` 目录
2. 重启 ComfyUI
3. 在菜单中找到：`🔵BB text editor → 🔵BB文本再次编辑`

---

## 使用方法

### 第一次使用

1. **添加节点**
   - 右键 → 添加节点 → `🔵BB text editor` → `🔵BB文本再次编辑`

2. **连接输入**
   - 将其他节点的文本输出连接到 `input_text`

3. **运行并编辑**
   - 点击 `Queue Prompt`
   - 文本会自动显示在 `editable_text` 框中
   - 编辑文本内容

4. **确认继续**
   - 点击 `✓ Confirm & Continue` 按钮
   - 工作流继续运行

### 后续使用

- **再次运行**：你的编辑内容会被保留，不会被覆盖
- **加载新输入**：点击 `🔄 Load New Input` 按钮 → 点击 `Queue Prompt`

---

## 重要提示

⭐ **编辑内容会被保留** - 多次运行不会覆盖你的编辑
💡 **加载新输入** - 只有点击刷新按钮才会加载新文本

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
