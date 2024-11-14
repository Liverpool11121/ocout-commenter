"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    // Код для сочетания клавиш Ctrl+Alt+C (комментирование всех строк с ocout)
    let disposable1 = vscode.commands.registerCommand('ocout-commenter.Comment', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // Выход, если нет редактора
        }
        // Получаем текст
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        // Если текст текст выделен
        if (selectedText) {
            // Проверка на наличие комментариев, добавленных плагином
            const isPluginComment = selectedText
                .split('\n')
                .some((line) => {
                return line.trim().startsWith('//__!!!__//');
            });
            if (isPluginComment) {
                // Если в выделении есть комметнарий, добавленный плагином, то удалим это комментирование
                const uncommentedText = selectedText
                    .split('\n')
                    .map((line) => line.replace(/^\/\/__!!!__\/\//, ''))
                    .join('\n');
                // Замена прокомментированнго текст на текст без комментариев
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, uncommentedText);
                });
            }
            else {
                // Комментируем текст, добавляя в начало каждой строки символ '//__!!!__//' (при наличии ocout в строке)
                const commentedText = selectedText
                    .split('\n')
                    .map((line) => {
                    if (line.trim().includes("ocout")) {
                        return `//__!!!__//${line}`;
                    }
                    else {
                        return line;
                    }
                })
                    .join('\n');
                // Замена прокомментированнго текст на текст без комментариев
                editor.edit((editBuilder) => {
                    editBuilder.replace(selection, commentedText);
                });
            }
        }
        else {
            // Если ничего не выделено, то работаем с текущей строкой
            const currentLine = editor.selection.active.line;
            const currentLineText = editor.document.lineAt(currentLine).text;
            const isPluginComment = currentLineText.trim().startsWith('//__!!!__//');
            if (isPluginComment) {
                editor.edit((editBuilder) => {
                    editBuilder.replace(new vscode.Range(currentLine, 0, currentLine, currentLineText.length), currentLineText.replace(/^\/\/__\!\!\!\__\/\//, ''));
                });
            }
            else {
                if (currentLineText.trim().includes("ocout")) {
                    editor.edit((editBuilder) => {
                        editBuilder.replace(new vscode.Range(currentLine, 0, currentLine, currentLineText.length), `//__!!!__//${currentLineText}`);
                    });
                }
            }
        }
    });
    // Код для сочетания клавиш Ctrl+Alt+D (удаление всех строк с комментариями плагина)
    let disposable2 = vscode.commands.registerCommand('ocout-commenter.Delete', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // Выход, если нет редактора
        }
        // Получаем текст
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        if (selectedText) {
            // Разбиваем текст на строки по символу переноса строки
            const lines = selectedText.split('\n');
            // Получаем все строки, не содержащие комментарий плагина
            const filteredLines = lines.filter((line) => !line.includes("//__!!!__//"));
            const newSelectedText = filteredLines.join('\n');
            // Заменяем выделенный текст
            editor.edit((editBuilder) => {
                editBuilder.replace(selection, newSelectedText);
            });
        }
        else {
            // Если ничего не выделено, то работаем с текущей строкой
            const currentLine = editor.selection.active.line;
            const currentLineText = editor.document.lineAt(currentLine).text;
            const isPluginComment = currentLineText.trim().startsWith('//__!!!__//');
            // Если текущаяя строка является комментарием, добавленным плагином, то удалим её
            if (isPluginComment) {
                const lineNumber = editor.selection.active.line;
                const range = new vscode.Range(lineNumber, 0, lineNumber + 1, 0);
                editor.edit((editBuilder) => {
                    editBuilder.delete(range);
                });
            }
        }
    });
    // Добавьте сочетаний клавиш в файл `package.json`
    context.subscriptions.push(disposable1);
    context.subscriptions.push(disposable2);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map