import $ from "jquery";

export const onOpenPanel = () => {
  $(".command-palette-root").toggleClass("show");
  $("#commandInput").focus();
};

export const onQueriedBookMarks = (
  result: chrome.bookmarks.BookmarkTreeNode[]
) => {
  console.log("onQueriedBookMarks: ", result);

  const template = `
    <div class="command-palette-group">
      <div class="command-palette-header">group header</div>
      ${result
        .map((item) => {
          return `
          <div class="command-palette-item" ${
            item.url ? 'data-jump="' + item.url + '"' : ""
          }>
            <span class="icon"></span>
            <div class="result-content">${item.title}</div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;

  $("#commandStack").html(template);
};
