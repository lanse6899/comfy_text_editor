/**
 * 🔵BB文本再次编辑 - ComfyUI Text Editor Node
 * Copyright © 2025 All Rights Reserved / 版权所有 © 2025 保留所有权利
 * 
 * License / 许可说明：
 * - Personal use & Learning: Free / 个人使用和学习研究：免费使用
 * - No Modification: Prohibited / 禁止修改源代码
 * - Commercial Platform: Must notify author / 商用平台方使用需通知作者
 */

import { app } from "../../scripts/app.js";

// 为TextEditorWithConfirm节点添加自定义UI
app.registerExtension({
    name: "TextEditor.ConfirmButton",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "TextEditorWithConfirm") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function () {
                const result = onNodeCreated?.apply(this, arguments);
                
                // 获取editable_text widget
                const editableWidget = this.widgets?.find(w => w.name === "editable_text");
                
                if (editableWidget) {
                    // 设置多行文本框
                    editableWidget.type = "text";
                    editableWidget.options = editableWidget.options || {};
                    editableWidget.options.multiline = true;
                    
                    // 添加确认按钮
                    const confirmButton = this.addWidget("button", "✓ Confirm & Continue", null, () => {
                        console.log("[Text Editor] Text confirmed!");
                        console.log("Edited content:", editableWidget.value);
                        
                        // 改变按钮样式
                        confirmButton.name = "✓✓ Confirmed!";
                        
                        // 触发重新执行工作流
                        app.queuePrompt(0, 1);
                    });
                    
                    // 按钮不序列化
                    confirmButton.serialize = false;
                }
                
                // 监听连接变化，自动复制input_text到editable_text
                const onConnectionsChange = this.onConnectionsChange;
                this.onConnectionsChange = function(type, index, connected, link_info) {
                    if (onConnectionsChange) {
                        onConnectionsChange.apply(this, arguments);
                    }
                    
                    // 当input_text连接时，复制值到editable_text
                    if (type === 1 && connected) { // type 1 = input
                        setTimeout(() => {
                            const inputWidget = this.widgets?.find(w => w.name === "input_text");
                            const editableWidget = this.widgets?.find(w => w.name === "editable_text");
                            
                            if (inputWidget && editableWidget && inputWidget.value) {
                                editableWidget.value = inputWidget.value;
                                console.log("[Text Editor] Auto-copied input to editable text");
                                app.graph.setDirtyCanvas(true);
                            }
                        }, 100);
                    }
                };
                
                // 监听执行完成，只在editable_text为空时自动填充
                const onExecuted = this.onExecuted;
                this.onExecuted = function(message) {
                    if (onExecuted) {
                        onExecuted.apply(this, arguments);
                    }
                    
                    const editableWidget = this.widgets?.find(w => w.name === "editable_text");
                    
                    // 只在editable_text为空时才自动填充
                    if (message && message.input_preview && message.input_preview.length > 0) {
                        if (editableWidget && (!editableWidget.value || editableWidget.value.trim() === "")) {
                            const newText = message.input_preview[0];
                            editableWidget.value = newText;
                            console.log("[Text Editor] Auto-filled from input (first run):", newText.substring(0, 50) + "...");
                            app.graph.setDirtyCanvas(true);
                        } else {
                            console.log("[Text Editor] Keeping edited text, not overwriting");
                        }
                    }
                };
                
                // 添加一个按钮来手动刷新输入文本
                const refreshButton = this.addWidget("button", "🔄 Load New Input", null, () => {
                    const editableWidget = this.widgets?.find(w => w.name === "editable_text");
                    if (editableWidget) {
                        // 清空editable_text，下次运行时会自动用input_text填充
                        editableWidget.value = "";
                        console.log("[Text Editor] Cleared editable_text");
                        console.log("[Text Editor] Click 'Queue Prompt' to load new input text");
                        app.graph.setDirtyCanvas(true);
                        
                        // 提示用户
                        alert("Text cleared! Click 'Queue Prompt' to load new input text.");
                    }
                });
                refreshButton.serialize = false;
                
                return result;
            };
        }
    }
});
