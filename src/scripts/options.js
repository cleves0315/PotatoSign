import ext from "./utils/ext";
import storage from "./utils/storage";

var colorSelectors = document.querySelectorAll(".js-radio");
var options = document.querySelector("#options");


var setColor = (color) => {
  document.body.style.backgroundColor = color;
};

const template = (data) => (`
  <div class="sign-item">
    <a class="sign-item-link" href="${data.url}" target="_blank">
      <div class="icon"><img src="${data.favIconUrl}" /></div>
      <div class="title">${data.title}</div>
      <div class="description">${data.description}</div>
    </a>
  </div>
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
    debugger
    const sign = (typeof result.sign === 'string') ? JSON.parse(result.sign) : result.sign
    const tmpl = sign.map(m => template(m))
    
    options.innerHTML = tmpl
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