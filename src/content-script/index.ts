import $ from "jquery";
import template from "./template.html";
import { onMessage } from "./message";
import { MessageTypeEnum } from "../constants";
import { onOpenPanel, onQueriedBookMarks } from "./utils";
import { handle } from "./handle";
import "./styles";

$("body").append(template);

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
