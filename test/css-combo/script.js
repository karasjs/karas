"use strict";

var css = {
  "#a": {
    "_v": [[0, ["color", "#F00"]]],
    "_p": [1, 0, 0]
  },
  ".a": {
    "_v": [[1, ["color", "#0F0"]]],
    "_p": [0, 1, 0]
  },
  "div": {
    "_v": [[2, ["color", "#00F"]]],
    "_p": [0, 0, 1]
  }
};
karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"], ["css", css]], [karas.createVd("div", [["id", "a"]], ["123"]), karas.createVd("div", [["class", "a"]], ["123"]), karas.createVd("div", [["class", "b"]], ["123"]), karas.createVd("div", [["id", "a"], ["class", "a"]], ["123"]), karas.createVd("div", [["id", "a"], ["class", "a b"]], ["123"])]), '#test');