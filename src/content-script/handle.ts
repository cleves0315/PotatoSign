import $ from "jquery";

export const handle = () => {
  $(".command-palette-mask").on("click", () => {
    $(".command-palette-root").removeClass("show");
  });

  let timer: NodeJS.Timeout = null;

  $("#commandInput").on("input", (e: any) => {
    const value = e.target.value;

    clearTimeout(timer);
    timer = setTimeout(() => {
      chrome.runtime.sendMessage({ type: "query", data: value });
    }, 800);
  });

  $(".result").on("click", (e) => {
    console.log("click: ", e.target.dataset);
    const { jump } = e.target?.dataset || {};
    jump && window.open(jump);
  });
};
