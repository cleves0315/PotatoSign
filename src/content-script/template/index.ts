import $ from "jquery";
import { MessageTypeEnum } from "../../constants";
import { onMessage } from "../../utils/message";

$("body").append(
  `<iframe
    id="potato-tag-iframe"
    class="potato-tag-iframe"
    src="${chrome.runtime.getURL("/content-script/template.html")}">
  </iframe>`
);

onMessage([MessageTypeEnum.openPanel], () => {
  $("#potato-tag-iframe").toggleClass("show");
});

$("#potato-tag-iframe").on("click", () => {
  $("#potato-tag-iframe").removeClass("show");
});
