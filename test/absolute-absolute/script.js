"use strict";

karas.render(karas.createVd("canvas", [["width", "360"], ["height", "360"]], [karas.createVd("div", [["style", {
  position: 'absolute',
  left: 100,
  top: 100,
  width: 100,
  height: 100
}]], [karas.createVd("div", [["style", {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  background: '#00F'
}]])])]), '#test');