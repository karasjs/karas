"use strict";

karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"]], [karas.createVd("img", [["src", "../image.png"], ["style", {
  transform: 'translate(50,50)'
}]])]), '#test');