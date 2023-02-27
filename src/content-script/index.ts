import $ from "jquery";
// import { template } from "./template";
import { onMessage } from "../utils/message";
import { MessageTypeEnum } from "../constants";
import { onOpenPanel, onQueriedBookMarks } from "./utils";
import { handle } from "./handle";
import "./styles/index.scss";

// console.log("template: ", template);

// $("body").append(template);
// $("body").append(
//   `<iframe id="potato-tag-iframe" src="chrome-extension://piolmgkcmbpnckniidjclpkecikbgcdh/template.html"></iframe>`
// );

onMessage(
  [MessageTypeEnum.openPanel, MessageTypeEnum.queryBookMarks],
  (message) => {
    const { type, data } = message;

    switch (type) {
      case MessageTypeEnum.openPanel:
        onOpenPanel();
        return;

      case MessageTypeEnum.queryBookMarks:
        onQueriedBookMarks(data);
        return;

      default:
        break;
    }
  }
);

handle();
