"use strict";

var css = {
  ".b": {
    "_~": {
      ".a": {
        "_v": [[0, ["color", "#F00"]]],
        "_p": [0, 2, 0]
      }
    }
  },
  ".c": {
    "_~": {
      ".a": {
        "_v": [[1, ["background", "#00F"]]],
        "_p": [0, 2, 0]
      }
    }
  }
};
karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"], ["css", css]], [karas.createVd("div", [["class", "a"]], ["123"]), karas.createVd("div", [["class", "b"]], ["123"]), karas.createVd("div", [["class", "c"]], ["123"]), karas.createVd("div", [["class", "b c"]], ["123"])]), '#test');