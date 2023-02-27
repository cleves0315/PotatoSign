import $ from "jquery";
// import style from "./styles/index.scss";

// console.log("content-style: ", style);

export const selectedTag = "command-palette-selected";

export const onOpenPanel = () => {
  $(".command-palette-root").toggleClass("show");
  $("#commandInput").focus();
};

export const onQueriedBookMarks = (
  result: chrome.bookmarks.BookmarkTreeNode[]
) => {
  console.log("onQueriedBookMarks: ", result);
  const attribute = (
    item: chrome.bookmarks.BookmarkTreeNode,
    index: number
  ) => {
    let attr = `data-index="${index}"`;

    if (item.url) {
      attr += ` data-jump-url="${item.url}"`;
    }
    return attr;
  };
  const bookIcon = (item: chrome.bookmarks.BookmarkTreeNode) => {
    if (item.url) {
      return `<img src="${faviconURL(item.url)}" alt="" />`;
    }
    return `<i class="iconfont" icon-folder"></i>`;
  };

  const template = `
    <div class="command-palette-group">
      <div class="command-palette-header">group header</div>
      ${result
        .map((item, index) => {
          return `
            <div class="command-palette-item ${
              index === 0 ? selectedTag : ""
            }" ${attribute(item, index)}>
              <span class="icon">${bookIcon(item)}</span>
              <div class="result-content">
                <div class="websize-title">${item.title}</div>
                <div class="websize-url">${item.url || ""}</div>
              </div>
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
  url.searchParams.set("size", s || "32");
  return url.toString();
};

export const switchTagUpDown = (direction: "up" | "down") => {
  const $PaletteItem = $(".command-palette-item");
  const index = +$(`.${selectedTag}`).attr("data-index");
  let next = direction === "up" ? index - 1 : index + 1;

  if (next < 0) {
    next = $PaletteItem.length - 1;
  } else if (next >= $PaletteItem.length) {
    next = 0;
  }

  $PaletteItem.eq(index).removeClass(selectedTag);
  $PaletteItem.eq(next).addClass(selectedTag);
};
