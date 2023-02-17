import { MessageTypeEnum } from "../constants";

export interface Message {
  type: MessageTypeEnum;
  data?: any;
}

export interface queryMsgData {
  type: MessageTypeEnum.queryBookMarks;
  data: chrome.bookmarks.BookmarkTreeNode[];
}
