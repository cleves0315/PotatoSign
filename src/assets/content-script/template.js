document.head.appendChild(`
  <link
    href="${chrome.runtime.getURL("/content-script/template.css")}"
    rel="stylesheet"
  >
`);
console.log(chrome.runtime.getURL("/content-script/template.html"));
document.body.appendChild(`
  <iframe
    id="potato-tag-iframe"
    class="potato-tag-iframe"
    src="${chrome.runtime.getURL("/content-script/template.html")}">
  </iframe>
`);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "666") {
    $("#potato-tag-iframe").toggleClass("show");
  }
});

$("#potato-tag-iframe").on("click", () => {
  $("#potato-tag-iframe").removeClass("show");
});
