import $ from "jquery";
import "./main.css";
import "./styles.css";

console.log("content-script", $);
// document.body.style.backgroundColor = "orange";

const template = `<div class="command-palette-root">
<div class="command-palette-mask"></div>

<div class="command-palette-wrap">
  <div class="command-palette-container">
    <div class="command-palette-input-container">
      <input
        id="commandInput"
        autofocus
        class="command-input"
        placeholder="请输入要查询的标签"
      />
    </div>

    <div class="command-palette-stack">
      <div>查询结果</div>
      <div class="result"></div>
    </div>
  </div>
</div>
</div>
`;

$("body").append(template);
$(".command-palette-mask,.command-palette-wrap").on("click", () => {
  console.log("click");
  $(".command-palette-root").addClass("hide");
});

let timer = null;

$("#commandInput").on("input", (e) => {
  console.log("change: ", e.target.value);
  const value = e.target.value;

  clearTimeout(timer);
  timer = setTimeout(() => {
    chrome.runtime.sendMessage({ type: "query", data: value }, (response) => {
      // 3. Got an asynchronous response with the data from the service worker
      // console.log("content-sendMessage: ", response);
    });
  }, 800);
});

$(() => {
  // 1. Send a message to the service worker requesting the user's data
  chrome.runtime.sendMessage({ type: "pageInit" }, (response) => {
    // 3. Got an asynchronous response with the data from the service worker
    // console.log("received user data", response);
    console.log("sendMessageResponse: ", response);
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("content-onMessage: ", message);
    $(".result").text(JSON.stringify(message?.data));
  });
});
