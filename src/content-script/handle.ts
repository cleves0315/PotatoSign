import $ from "jquery";
import { MessageTypeEnum } from "../constants";
import { sendMessage } from "../utils/message";
import { closeRoot } from "./utils";

export const handle = () => {
  console.log("handle");

  $(".command-palette-mask").on("click", () => {
    closeRoot();
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
    const { jumpUrl } = e.target?.dataset || {};

    if (jumpUrl) {
      closeRoot();
      window.open(jumpUrl);
    }
  });

  $(".command-palette-root").on("keydown", (e) => {
    if (e.key === "ArrowUp") {
      console.log("ArrowUp");
    }
    if (e.key === "ArrowDown") {
      console.log("ArrowDown");
    }
  });
};
