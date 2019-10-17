"use strict";

var css = {
  ".b": {
    ".a": {
      "_v": [[0, ["color", "#F00"]]],
      "_p": [0, 2, 0]
    }
  }
};
karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"], ["css", css]], [karas.createVd("div", [["class", "a"]], [karas.createVd("div", [["class", "b"]], ["123"])]), karas.createVd("div", [["class", "a"]], [karas.createVd("div", [], [karas.createVd("div", [["class", "b"]], ["123"])])])]), '#test');