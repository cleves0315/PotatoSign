import $ from "jquery";
import template from "./template.html";

import "./styles";

const sendMessage = (type: string) => {
  chrome.runtime.sendMessage({ type: "query" }, (response) => {
    console.log("sendMessageResponse: ", response);
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("content-onMessage: ", message);
  const { type, data } = message;

  if (type === "open-panel") {
    $(".command-palette-root").toggleClass("show");
    $("#commandInput").focus();
  } else if (type === "query") {
    $(".result").text(
      data.map((item: any) => {
        return `${item.title}    ${item.url}\n`;
      })
    );
  }
});

// ========================

$("body").append(template);
$(".command-palette-mask,.command-palette-wrap").on("click", () => {
  // $(".command-palette-root").removeClass("show");
});

let timer: NodeJS.Timeout = null;

$("#commandInput").on("input", (e: any) => {
  const value = e.target.value;

  clearTimeout(timer);
  timer = setTimeout(() => {
    chrome.runtime.sendMessage({ type: "query", data: value });
  }, 800);
});
