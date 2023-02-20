import { MessageTypeEnum } from "../constants";
import { Message } from "../types";

export const sendTabMessage = (tabId: number, message: Message) => {
  return chrome.tabs.sendMessage(tabId, message);
};

export const sendMessage = (message: Message) => {
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
    if (queue.includes(message.type)) {
      callback(message, sender, sendResponse);
    }
  });
};
