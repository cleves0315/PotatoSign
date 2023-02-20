import $ from "jquery";
import { folderIcon } from "../constants";

export const onOpenPanel = () => {
  $(".command-palette-root").toggleClass("show");
  $("#commandInput").focus();
};

export const onQueriedBookMarks = (
  result: chrome.bookmarks.BookmarkTreeNode[]
) => {
  console.log("onQueriedBookMarks: ", result);
  const attribute = (item: chrome.bookmarks.BookmarkTreeNode) => {
    if (item.url) {
      return 'data-jump-url="' + item.url + '"';
    }
    return "";
  };
  const bookIcon = (item: chrome.bookmarks.BookmarkTreeNode) => {
    if (item.url) {
      return `<img src="${faviconURL(item.url)}" alt="" />`;
    }
    return folderIcon;
  };

  const template = `
    <div class="command-palette-group">
      <div class="command-palette-header">group header</div>
      ${result
        .map((item) => {
          return `
          <div class="command-palette-item" ${attribute(item)}>
            <span class="icon">
              ${bookIcon(item)}
            </span>
            <div class="result-content">${item.title}</div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;

  $("#commandStack").html(template);
};

export const closeRoot = () => {
  $(".command-palette-root").removeClass("show");
};

export const faviconURL = (u: string, s?: string) => {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", s || "16");
  return url.toString();
};
