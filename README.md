### todo

- 框架：自动热更新（插件自动加载）
- 去掉 .LICENSE.txt 文件

### 文档

- [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab)
- [Content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#static-declarative)
- [chrome. bookmarks](https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged)
- [chrome. scripting](https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript)
- [chrome.runtime](https://developer.chrome.com/docs/extensions/reference/)

```
扩展快捷键设置中心
chrome://extensions/shortcuts
```

### [delay] 验证命令初始化是否成功

```
// background.js
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    checkCommandShortcuts();
  }
});

// Only use this function during the initial install phase. After
// installation the user may have intentionally unassigned commands.
function checkCommandShortcuts() {
  chrome.commands.getAll((commands) => {
    let missingShortcuts = [];

    for (let {name, shortcut} of commands) {
      if (shortcut === '') {
        missingShortcuts.push(name);
      }
    }

    if (missingShortcuts.length > 0) {
      // Update the extension UI to inform the user that one or more
      // commands are currently unassigned.
    }
  });
}

```
