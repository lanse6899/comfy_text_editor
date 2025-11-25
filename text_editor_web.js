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
                    
                    // 添加只执行当前节点按钮
                    const executeNodeButton = this.addWidget("button", "⚡ Execute Node + Display", null, () => {
                        console.log("[Text Editor] 执行当前节点和连接的展示节点!");
                        console.log("编辑内容:", editableWidget.value);
                        
                        // 改变按钮样式
                        executeNodeButton.name = "⚡ 执行中...";
                        
                        // 执行当前节点和连接的展示节点
                        this.executeNode();
                        
                        // 2秒后恢复按钮名称
                        setTimeout(() => {
                            executeNodeButton.name = "⚡ Execute Node + Display";
                        }, 2000);
                    });
                    
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
                    executeNodeButton.serialize = false;
                    
                    // 添加执行单个节点的方法
                    this.executeNode = function() {
                        // 执行当前节点
                        this.executeNodeLocally();
                        
                        // 执行连接的展示文本节点
                        this.executeConnectedDisplayNodes();
                    };
                    
                    // 本地执行方法
                    this.executeNodeLocally = function() {
                        const inputWidget = this.widgets?.find(w => w.name === "input_text");
                        const editableWidget = this.widgets?.find(w => w.name === "editable_text");
                        
                        const inputText = inputWidget?.value || "";
                        const editableText = editableWidget?.value || "";
                        
                        // 执行节点的核心逻辑（与Python代码保持一致）
                        let output;
                        if (!editableText || editableText.trim() === "") {
                            output = inputText;
                            console.log(`[Text Editor] 本地执行 - 使用输入文本 (${output.length} 字符)`);
                        } else {
                            output = editableText;
                            console.log(`[Text Editor] 本地执行 - 使用编辑文本 (${output.length} 字符)`);
                        }
                        
                        // 在控制台显示处理的文本预览
                        if (output.length > 100) {
                            console.log(`预览: ${output.substring(0, 100)}...`);
                        } else {
                            console.log(`内容: ${output}`);
                        }
                        
                        // 更新UI显示
                        const uiData = {
                            text: [output],
                            input_preview: [inputText]
                        };
                        
                        // 触发节点的onExecuted事件
                        if (this.onExecuted) {
                            this.onExecuted(uiData);
                        }
                        
                        // 更新画布显示
                        app.graph.setDirtyCanvas(true);
                        
                        console.log("[Text Editor] ✅ 当前节点执行完成！");
                        
                        // 显示成功提示
                        const notification = document.createElement('div');
                        notification.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: #4CAF50;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            z-index: 10000;
                            font-family: Arial, sans-serif;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        `;
                        notification.textContent = '✅ 节点和展示执行完成！';
                        document.body.appendChild(notification);
                        
                        // 3秒后移除通知
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 3000);
                    };
                    
                    // 执行连接的展示文本节点
                    this.executeConnectedDisplayNodes = function() {
                        // 获取当前节点的输出连接
                        const outputSlot = 0; // output_text是第0个输出
                        
                        if (this.outputs && this.outputs[outputSlot] && this.outputs[outputSlot].links) {
                            const links = this.outputs[outputSlot].links;
                            
                            console.log(`[Text Editor] 找到 ${links.length} 个输出连接`);
                            
                            // 遍历所有连接的节点
                            links.forEach((linkId, index) => {
                                const link = app.graph.links[linkId];
                                if (link) {
                                    const targetNodeId = link.target_id;
                                    const targetNode = app.graph.getNodeById(targetNodeId);
                                    
                                    if (targetNode) {
                                        console.log(`[Text Editor] 执行连接的节点: ${targetNode.type} (ID: ${targetNodeId})`);
                                        
                                        // 延迟执行，确保当前节点的输出已经更新
                                        setTimeout(() => {
                                            this.executeDisplayNode(targetNode, index);
                                        }, 100 * (index + 1)); // 如果有多个连接，错开执行时间
                                    }
                                }
                            });
                        } else {
                            console.log("[Text Editor] 没有找到输出连接的节点");
                        }
                    };
                    
                    // 执行单个展示节点
                    this.executeDisplayNode = function(targetNode, index) {
                        try {
                            // 获取当前节点的输出文本
                            const currentOutput = this.getNodeOutput();
                            
                            console.log(`[Text Editor] 向节点 ${targetNode.type} 传递文本 (${currentOutput.length} 字符)`);
                            
                            // 更新目标节点的输入
                            if (targetNode.widgets) {
                                // 查找文本相关的输入widget
                                const textWidgets = targetNode.widgets.filter(w => 
                                    w.type === "text" || 
                                    w.name.includes("text") || 
                                    w.name.includes("string") ||
                                    w.name.includes("input")
                                );
                                
                                if (textWidgets.length > 0) {
                                    // 更新第一个文本widget
                                    textWidgets[0].value = currentOutput;
                                    console.log(`[Text Editor] 更新了 ${targetNode.type} 的 ${textWidgets[0].name} widget`);
                                }
                            }
                            
                            // 如果目标节点有执行方法，调用它
                            if (typeof targetNode.onExecuted === 'function') {
                                const uiData = {
                                    text: [currentOutput]
                                };
                                targetNode.onExecuted(uiData);
                                console.log(`[Text Editor] 执行了 ${targetNode.type} 的 onExecuted 方法`);
                            }
                            
                            // 如果是显示文本的节点，直接更新显示
                            if (targetNode.type && (
                                targetNode.type.includes("Text") || 
                                targetNode.type.includes("Display") || 
                                targetNode.type.includes("Show") ||
                                targetNode.type.includes("Preview")
                            )) {
                                // 强制更新节点显示
                                if (targetNode.setDirtyCanvas) {
                                    targetNode.setDirtyCanvas(true);
                                }
                                console.log(`[Text Editor] 更新了展示节点 ${targetNode.type} 的显示`);
                            }
                            
                            // 更新画布
                            app.graph.setDirtyCanvas(true);
                            
                            console.log(`[Text Editor] ✅ 展示节点 ${targetNode.type} 执行完成`);
                            
                        } catch (error) {
                            console.error(`[Text Editor] 执行展示节点时出错:`, error);
                        }
                    };
                    
                    // 获取当前节点的输出文本
                    this.getNodeOutput = function() {
                        const inputWidget = this.widgets?.find(w => w.name === "input_text");
                        const editableWidget = this.widgets?.find(w => w.name === "editable_text");
                        
                        const inputText = inputWidget?.value || "";
                        const editableText = editableWidget?.value || "";
                        
                        // 使用与executeNodeLocally相同的逻辑
                        if (!editableText || editableText.trim() === "") {
                            return inputText;
                        } else {
                            return editableText;
                        }
                    };
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
