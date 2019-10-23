"use strict";

var o = karas.render(karas.createVd("svg", [["width", "360"], ["height", "360"]], [karas.createVd("img", [["src", "../error.png"]])]), '#test');
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);