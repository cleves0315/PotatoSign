console.log("background");

// debug -> reload extension
chrome.action.onClicked.addListener(() => {
  chrome.runtime.reload();
});

chrome.commands.onCommand.addListener((command, tabs) => {
  console.log(`Command "${command}" triggered: `, tabs);
  // open -> panel
  if (command === "open-panel") {
    chrome.tabs.sendMessage(tabs?.id, {
      type: "open-panel",
    });
  }

  // debug -> reload extension
  if (command === "debug-reload") {
    chrome.runtime.reload();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message.type === "query" &&
    message.data &&
    typeof message.data === "string"
  ) {
    sendTree(sender.tab.id, message.data);
  }
});

const sendTree = (tabId: number, query: string) => {
  // chrome.bookmarks.search("https://github.com/hunshcn/gh-proxy", (results) => {
  chrome.bookmarks.search(query, (results) => {
    console.log("search-results: ", results);
    chrome.tabs.sendMessage(tabId, {
      type: "query",
      data: results,
    });
  });
};

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
