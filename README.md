### todo

- 框架：自动热更新（插件自动加载）
- 去掉 .LICENSE.txt 文件

### 文档

- [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/tabs/#type-Tab)
- [Content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#static-declarative)
- [chrome. bookmarks](https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged)
- [chrome. scripting](https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript)
- [chrome.runtime](https://developer.chrome.com/docs/extensions/reference/)
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

```
// chrome.bookmarks.getTree((results) => {
//   console.log("getTree-results: ", results);
// });

// chrome.bookmarks.getSubTree("226", (results) => {
//   console.log("getSubTree-results: ", results);
// });

// chrome.bookmarks.search("https://github.com/hunshcn/gh-proxy", (results) => {
//   console.log("search-results: ", results);
// });

// const url = "https://github.com/hunshcn/gh-proxy";
// const websiteIcon = `chrome://favicon2/?size=16&scaleFactor=1x&pageUrl=${url}&allowGoogleServerFallback=0`;

// chrome://favicon2/?size=16&scaleFactor=1x&pageUrl=https%3A%2F%2Fgithub.com%2Fhunshcn%2Fgh-proxy&allowGoogleServerFallback=0
// chrome://favicon2/?size=16&scaleFactor=1x&pageUrl=https%3A%2F%2Ffonts.google.com%2F&allowGoogleServerFallback=0

// https://github.com/hunshcn/gh-proxy&allowGoogleServerFallback=0
// https://fonts.google.com/&allowGoogleServerFallback=0

// chrome://favicon2/?size=16&scaleFactor=1x&pageUrl=
// https://exmail.qq.com/cgi-bin/frame_html?sid=YHt2cFcoK5QfKgZm,7&sign_type=&r=8378968a8cf396c320ed609ef7e8a0ff

```
