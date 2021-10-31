import ext from "./utils/ext";

var extractTags = (value) => {
  var url = document.location.href;
  if(!url || !url.match(/^http/)) return;

  var data = {
    title: "",
    description: "",
    favIconUrl: "",
    url: document.location.href
  }

  var ogTitle = document.querySelector("meta[property='og:title']");
  if(ogTitle) {
    data.title = ogTitle.getAttribute("content")
  } else {
    data.title = document.title
  }

  var descriptionTag = document.querySelector("meta[property='og:description']") || document.querySelector("meta[name='description']")
  if(descriptionTag) {
    data.description = descriptionTag.getAttribute("content")
  }

  if (value) {
    data.favIconUrl = value.favIconUrl
  }

  return data;
}

function onRequest(request, sender, sendResponse) {
  console.log('process-page ,', request)
  if (request.action === 'process-page') {
    sendResponse(extractTags(request.value))
  }
}

function injectCustomJs(jsPath) {
  jsPath = jsPath || 'scripts/inject.js'

  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.extension.getURL(jsPath)
  temp.onload = function() {
    this.parentNode.removeChild(this)
  }

  document.head.appendChild(temp)
}
injectCustomJs()

ext.runtime.onMessage.addListener(onRequest);