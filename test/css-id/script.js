"use strict";

var css = {
  "#a": {
    "_v": [[0, ["color", "#F00"]]],
    "_p": [1, 0, 0]
  }
};
karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"], ["css", css]], [karas.createVd("div", [["id", "a"]], ["123"])]), '#test');