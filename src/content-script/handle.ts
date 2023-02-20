import $ from "jquery";
import { MessageTypeEnum } from "../constants";
import { sendMessage } from "../utils/message";
import { switchTagUpDown, closeRoot, selectedTag } from "./utils";

export const handle = () => {
  console.log("handle");

  $(".command-palette-mask").on("click", () => {
    closeRoot();
  });

  let timer: NodeJS.Timeout = null;

  $("#commandInput").on("input", (e: any) => {
    const value = e.target.value;
    clearTimeout(timer);

    if (value) {
      timer = setTimeout(() => {
        sendMessage({ type: MessageTypeEnum.queryBookMarks, data: value });
      }, 500);
    } else {
      $("#commandStack").html("");
    }
  });

  $("#commandStack").on("click", (e) => {
    console.log("click: ", e.target.dataset);
    const { jumpUrl } = e.target?.dataset || {};
    if (jumpUrl) {
      closeRoot();
      window.open(jumpUrl);
    }
  });

  $("#commandInput").on("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.stopPropagation();
      console.log("ArrowUp");
      switchTagUpDown("up");
      return false;
    }
    if (e.key === "ArrowDown") {
      e.stopPropagation();
      switchTagUpDown("down");
      console.log("ArrowDown");
      return false;
    }
    if (e.key === "Enter") {
      const jumpUrl = $(`.${selectedTag}`).eq(0).attr("data-jump-url");
      if (jumpUrl) {
        closeRoot();
        window.open(jumpUrl);
      }
      return;
    }
  });
};
