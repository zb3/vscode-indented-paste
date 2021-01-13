'use strict';

const vscode = require("vscode");
let isPasting = false;

function getCommonIndentLength(lines) {
  var minLevel = Infinity;

  for (const line of lines) {
    const isEmptyLine = /^\s*$/.test(line);

    if (!isEmptyLine) { // empty lines are not taken into account
      const currentIndentLength = line.match(/^[ \t]*/)[0].length;
      minLevel = Math.min(minLevel, currentIndentLength);
    }
  }

  return isFinite(minLevel) ? minLevel : 0;
}

function getTextToPaste(editor, selection, pastedLines) {
  const currentLineText = editor.document.lineAt(selection.start.line).text;
  const currentPrefix = currentLineText.substr(0, selection.start.character);

  const commonIndentLength = getCommonIndentLength(pastedLines);

  let newPastedLines = [];
  let firstLine = true;

  for (let line of pastedLines) {
    if (commonIndentLength && commonIndentLength <= line.length) {
      line = line.slice(commonIndentLength);
    }

    if (!firstLine) {
      line = currentPrefix + line;
    } else {
      firstLine = false;
    }

    newPastedLines.push(line);
  }

  return newPastedLines.join('\n');
}

async function indentedPaste(editor, _) {
  if (isPasting) {
    return;
  }

  isPasting = true;

  try {
    const clipboard = vscode.env.clipboard;

    const pastedText = await clipboard.readText();
    const pastedLines = pastedText.split('\n');

    if (editor.selections.length > 1) {
      await editor.edit(edit => {
        for (const selection of editor.selections) {
          const newPastedText = getTextToPaste(editor, selection, pastedLines);

          edit.replace(selection, newPastedText);
        }
      });

      // adjust cursor positions
      const selections = [];
      for (const selection of editor.selections) {
        selections.push(new vscode.Selection(selection.end, selection.end));
      }
      editor.selections = selections;

    } else {
      // if there's only one selection, we can use clipboardPasteAction
      // so that other paste-related functionality can work properly

      const newPastedText = getTextToPaste(editor, editor.selection, pastedLines);

      await clipboard.writeText(newPastedText);
      await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
      await clipboard.writeText(pastedText);
    }
  } catch (e) {
    console.log("Paste error:", e);
  } finally {
    isPasting = false;
  }
}

exports.activate = function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('indentedPaste.action', indentedPaste)
  );
};
