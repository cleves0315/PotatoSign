import { MessageTypeEnum } from "../constants";
import { sendTabMessage } from "../content-script/message";

export const openPanel = (tabId: number) => {
  sendTabMessage(tabId, { type: MessageTypeEnum.openPanel });
};

export const queryBookMarks = (tabId: number, query: string) => {
  chrome.bookmarks.search(query, (results) => {
    console.log("search-bookmarks: ", results);
    sendTabMessage(tabId, {
      type: MessageTypeEnum.queryBookMarks,
      data: results,
    });
  });
};
