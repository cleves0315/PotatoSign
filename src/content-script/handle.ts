import $ from "jquery";
import { MessageTypeEnum } from "../constants";
import { sendMessage } from "../utils/message";

export const handle = () => {
  $(".command-palette-mask").on("click", () => {
    $(".command-palette-root").removeClass("show");
  });

  let timer: NodeJS.Timeout = null;

  $("#commandInput").on("input", (e: any) => {
    const value = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      sendMessage({ type: MessageTypeEnum.queryBookMarks, data: value });
    }, 800);
  });

  $("#commandStack").on("click", (e) => {
    console.log("click: ", e.target.dataset);
    const { jump } = e.target?.dataset || {};
    jump && window.open(jump);
  });
};
