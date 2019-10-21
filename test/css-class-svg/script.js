"use strict";

var css = {
  ".a": {
    "_v": [[0, ["color", "#F00"]]],
    "_p": [0, 1, 0]
  },
  ".b": {
    "_v": [[1, ["color", "#00F"]]],
    "_p": [0, 1, 0]
  },
  ".c": {
    "_v": [[2, ["color", "#F00"]]],
    "_p": [0, 1, 0]
  },
  ".d": {
    "_v": [[3, ["color", "#00F"]]],
    "_p": [0, 1, 0]
  },
  ".d.c": {
    "_v": [[4, ["color", "#0F0"]]],
    "_p": [0, 2, 0]
  }
};
var o = karas.render(karas.createVd("svg", [["width", "360"], ["height", "360"], ["css", css]], [karas.createVd("div", [["class", "a"]], ["123"]), karas.createVd("div", [["class", "a b"]], ["123"]), karas.createVd("div", [["class", "b a"]], ["123"]), karas.createVd("div", [["class", "c d"]], ["123"])]), '#test');
document.querySelector('input').value = JSON.stringify(o.virtualDom);