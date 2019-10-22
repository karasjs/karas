"use strict";

karas.render(karas.createVd("svg", [["width", "360"], ["height", "360"], ["style", {
  background: 'linear-gradient(#F00,#00F)'
}]]), '#test');
karas.render(karas.createVd("svg", [["width", "360"], ["height", "360"], ["style", {
  background: 'linear-gradient(#F00,#00F)'
}]]), '#test');
var o = karas.render(karas.createVd("svg", [["width", "360"], ["height", "360"], ["style", {
  background: 'linear-gradient(#F00,#00F)'
}]]), '#test2');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);