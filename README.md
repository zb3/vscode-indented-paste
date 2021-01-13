# Indented Paste

This VSCode extension makes it possible to paste with the indent at cursor position by pressing  <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>. 

Unless you're using indentation for plain text documents (which is what I do), this extension is probably not what you're looking for, it doesn't ensure correct code indentation after pasting.

## Installing
1. Manually clone this repository into the folder where extensions are installed
2. Restart VSCode

On Linux, this should do the first step:
```
cd ~/.vscode 2>/dev/null || cd ~/.vscode-oss
mkdir -p extensions
cd extensions
git clone https://github.com/zb3/vscode-indented-paste
```

## Settings
The command to rebind is:
```
indentedPaste.action
```

By default, it's bound to <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>
