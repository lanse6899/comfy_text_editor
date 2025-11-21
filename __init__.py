"""
🔵BB文本再次编辑 - ComfyUI Text Editor Node
Copyright © 2025 All Rights Reserved / 版权所有 © 2025 保留所有权利

License / 许可说明：
- Personal use & Learning: Free / 个人使用和学习研究：免费使用
- No Modification: Prohibited / 禁止修改源代码
- Commercial Platform: Must notify author / 商用平台方使用需通知作者
"""

from .text_editor_node import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

# 导出Web扩展
WEB_DIRECTORY = "."

__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS', 'WEB_DIRECTORY']
