import ext from "./utils/ext";
import storage from "./utils/storage";

var colorSelectors = document.querySelectorAll(".js-radio");
var options = document.querySelector("#options");


var setColor = (color) => {
  document.body.style.backgroundColor = color;
};

const template = (data) => (`
  <a class="sign-item-link" href="${data.url}" title="${data.description}" target="_blank">
    <div class="sign-item">
      <div class="del-wrap" data-data="${JSON.stringify(data)}"><div class="del-btn"></div></div>
      <div class="icon"><img src="${data.favIconUrl}" /></div>
      <div class="title"><p>${data.title}</p></div>
    </div>
  </a>
`)

storage.get('color', function(resp) {
  var color = resp.color;
  var option;
  if(color) {
    option = document.querySelector(`.js-radio.${color}`);
    setColor(color);
  } else {
    option = colorSelectors[0]
  }

  option.setAttribute("checked", "checked");
});

storage.get('sign', function(result) {
  console.log('get sign: ', JSON.parse(result.sign))
  if (result && result.sign) {
    const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
    const tmpl = sign.map(m => template(m))
    
    options.innerHTML = tmpl.join('')
    addElementEvents()
  }
})

colorSelectors.forEach(function(el) {
  el.addEventListener("click", function(e) {
    var value = this.value;
    storage.set({ color: value }, function() {
      setColor(value);
    });
  })
})


function handleToDelSign(e) {
  console.log('handleToDelSign: ', e)
  // e.stopPropagation();
}

function addElementEvents() {
  document.querySelectorAll('.del-wrap')
    .forEach(elm => {
      elm.addEventListener('click', handleToDelSign)
    })
}
