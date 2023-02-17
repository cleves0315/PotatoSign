import { MessageTypeEnum } from "../constants";
import { Message } from "../types";

export const sendTabMessage = <M = any, R = any>(
  tabId: number,
  message: M
): Promise<R> => {
  return chrome.tabs.sendMessage(tabId, message);
};

export const sendMessage = <M = any, R = any>(message: M): Promise<R> => {
  return chrome.runtime.sendMessage(message);
};

export const onMessage = (
  queue: MessageTypeEnum[],
  callback: (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
) => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("content-onMessage: ", message, queue);
    if (queue.includes(message.type)) {
      callback(message, sender, sendResponse);
    }
  });
};
