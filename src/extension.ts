import * as vscode from 'vscode';
import * as jsonc from 'jsonc-parser';

export function activate(context: vscode.ExtensionContext) {

    let validateCommand = vscode.commands.registerCommand('jsonEditor.validate', () => {
        validateJson();
    });

    let prettifyCommand = vscode.commands.registerCommand('jsonEditor.prettify', () => {
        formatJson(true);
    });

    let minifyCommand = vscode.commands.registerCommand('jsonEditor.minify', () => {
        formatJson(false);
    });

    context.subscriptions.push(validateCommand, prettifyCommand, minifyCommand);
}

function validateJson() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const document = editor.document;
    const text = document.getText();

    try {
        JSON.parse(text);
        vscode.window.showInformationMessage('JSON is valid');
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Invalid JSON: ${error.message}`);
        }
    }
}

function formatJson(prettify: boolean) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const document = editor.document;
    const text = document.getText();

    try {
        const jsonObject = JSON.parse(text);
        const formattedJson = JSON.stringify(jsonObject, null, prettify ? 2 : 0);

        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editBuilder.replace(fullRange, formattedJson);
        });

        vscode.window.showInformationMessage(prettify ? 'JSON prettified' : 'JSON minified');
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error formatting JSON: ${error.message}`);
        }
    }
}

export function deactivate() {}