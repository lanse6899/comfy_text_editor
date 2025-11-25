"""
🔵BB文本再次编辑 - ComfyUI Text Editor Node
Copyright © 2025 All Rights Reserved / 版权所有 © 2025 保留所有权利

License / 许可说明：
- Personal use & Learning: Free / 个人使用和学习研究：免费使用
- No Modification: Prohibited / 禁止修改源代码
- Commercial Platform: Must notify author / 商用平台方使用需通知作者
"""

class TextEditorWithConfirm:
    """
    文本编辑器节点 - 带确认按钮，暂停工作流等待编辑
    使用方法：
    1. 连接其他节点的文本输出到input_text
    2. 运行工作流，会在此节点暂停
    3. 在editable_text中编辑文本
    4. 点击Confirm按钮继续运行
    """
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "input_text": ("STRING", {
                    "multiline": True,
                    "default": "",
                    "forceInput": True
                }),
                "editable_text": ("STRING", {
                    "multiline": True,
                    "default": "",
                }),
            },
            "hidden": {
                "unique_id": "UNIQUE_ID",
            },
        }
    
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("output_text",)
    FUNCTION = "edit_text"
    CATEGORY = "🔵BB text editor"
    OUTPUT_NODE = False
    
    @classmethod
    def IS_CHANGED(cls, input_text, editable_text, unique_id):
        # 每次输入改变时都重新执行
        return float("nan")
    
    def edit_text(self, input_text, editable_text, unique_id=None):
        """
        处理文本输入
        如果editable_text为空，使用input_text
        否则使用editable_text（用户编辑后的内容）
        重要：保留用户的编辑内容，不自动覆盖
        """
        # 如果editable_text为空，使用input_text
        if not editable_text or editable_text.strip() == "":
            output = input_text if input_text else ""
            print(f"\n[Text Editor] First run - using input_text ({len(output)} chars)")
            # 只在第一次运行时发送input_text到前端
            return {
                "ui": {
                    "text": [output],
                    "input_preview": [input_text]  # 仅用于预览，不覆盖editable_text
                }, 
                "result": (output,)
            }
        else:
            # 使用用户编辑后的文本
            output = editable_text
            print(f"\n[Text Editor] Using edited_text ({len(output)} chars)")
        
        # 在控制台显示当前处理的文本
        if len(output) > 100:
            print(f"Preview: {output[:100]}...")
        else:
            print(f"Content: {output}")
        
        # 不发送editable_text到UI，保留用户的编辑
        return {
            "ui": {
                "text": [output],
                "input_preview": [input_text]  # 显示当前输入，但不覆盖
            }, 
            "result": (output,)
        }


NODE_CLASS_MAPPINGS = {
    "TextEditorWithConfirm": TextEditorWithConfirm,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "TextEditorWithConfirm": "🔵BB文本再次编辑",
}