console.log("background");

chrome.commands.getAll((commands) => {
  console.log("getAllcommands: ", commands);
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background-onMessage: ", message);
  if (message.type === "pageInit") {
    sendResponse({ message: "background: init-ok" });
  }

  if (
    message.type === "query" &&
    message.data &&
    typeof message.data === "string"
  ) {
    sendTree(sender.tab.id, message.data);
    chrome.bookmarks.search(message.data, (results) => {
      sendResponse(results);
    });
  }
});

const sendTree = (tabId, query) => {
  console.log("background-sendTree");
  // chrome.bookmarks.search("https://github.com/hunshcn/gh-proxy", (results) => {
  chrome.bookmarks.search(query, (results) => {
    console.log("search-results: ", results);
    chrome.tabs.sendMessage(tabId, {
      type: "background: query",
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
