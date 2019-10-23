"use strict";

var o = karas.render(karas.createVd("svg", [["width", "360"], ["height", "360"]], [karas.createVd("img", [["src", "../image.png"], ["style", {
  width: 100,
  height: 200
}]])]), '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);