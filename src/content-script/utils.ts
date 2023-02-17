import $ from "jquery";

export const onOpenPanel = () => {
  $(".command-palette-root").toggleClass("show");
  $("#commandInput").focus();
};

export const onQueriedBookMarks = (
  data: chrome.bookmarks.BookmarkTreeNode[]
) => {
  const bookmarkTreeNode = data;

  $(".result").html(
    bookmarkTreeNode
      .map((item) => {
        // 文件夹
        if (item.dateGroupModified) {
          return `
            <div class="result-item">文件夹: ${item.title}</div>
          `;
        }

        // 书签
        return `
          <div class="result-item" data-jump="${item.url}">${item.title}  ${item.url}</div>
        `;
      })
      .join("")
  );
};
