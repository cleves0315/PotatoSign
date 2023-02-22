### todo

- 上下切换选中状态元素在容器外部看不见时，滚动条自动定位到可见区域
- css 类名哈希，防止样式冲突
- 框架：自动热更新（插件自动加载）
- background 接收消息后处理异常捕获
- [test]打开面板时默认展示(历史搜索)
- [test]搜索优先查找当前打开的 tab，如果匹配到已打开的 tab 直接定位打开这个 tab 页面
- ~~ icon 更换 chrome.runtime.getURL 请求资源 ~~
- ~~ 去掉 .LICENSE.txt 文件 ~~
- ~~ webpack 配置不输出 ts 错误信息 ~~

### docs

- [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab)
- [Content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#static-declarative)
- [chrome. bookmarks](https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged)
- [chrome. scripting](https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript)
- [chrome.runtime](https://developer.chrome.com/docs/extensions/reference/runtime)
- [chrome.commands](https://developer.chrome.com/docs/extensions/reference/commands/)

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
