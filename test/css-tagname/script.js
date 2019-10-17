"use strict";

var css = {
  "div": {
    "_v": [[0, ["color", "#F00"]]],
    "_p": [0, 0, 1]
  }
};
karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"], ["css", css]], [karas.createVd("div", [["id", "a"]], ["123"])]), '#test');