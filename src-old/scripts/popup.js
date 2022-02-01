import ext from './utils/ext';

var popup = document.getElementById('app');

var template = data => {
  var json = JSON.stringify(data);
  return `
  <div class="site-description">
    <h3 class="title">${data.title}</h3>
    <p class="description">${data.description}</p>
    <a href="${data.url}" target="_blank" class="url">${data.url}</a>
  </div>
  <div class="action-container">
    <button data-bookmark='${json}' id="save-btn" class="btn btn-primary">保存</button>
  </div>
  `;
};

var renderMessage = message => {
  var displayContainer = document.getElementById('display-container');
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
};

var renderBookmark = data => {
  var displayContainer = document.getElementById('display-container');
  if (data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;
  } else {
    renderMessage('抱歉，无法提取该页面的url');
  }
};

ext.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  console.log('activeTab: ', activeTab);
  chrome.tabs.sendMessage(
    activeTab.id,
    { action: 'process-page', value: activeTab },
    renderBookmark
  );
});

popup.addEventListener('click', function (e) {
  if (e.target && e.target.matches('#save-btn')) {
    e.preventDefault();
    var data = e.target.getAttribute('data-bookmark');

    ext.runtime.sendMessage(
      { action: 'perform-save', data: data },
      function (response) {
        console.log('sendMessage - callback ', response);
        if (response && response.action === 'saved') {
          renderMessage('书签已成功保存 (•̀∀•́)');
        } else {
          renderMessage('抱歉，保存时出错了 ╥﹏╥');
        }
      }
    );
  }
});

var optionsLink = document.querySelector('.js-options');
optionsLink.addEventListener('click', function (e) {
  e.preventDefault();
  ext.tabs.create({ url: ext.extension.getURL('options.html') });
});
