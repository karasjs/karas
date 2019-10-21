var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",2],["y",2],["width",100],["height",50],["fill","url(#karas-defs-0-0)"],["stroke","#000"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",2],["y",56],["width",100],["height",50],["fill","url(#karas-defs-0-1)"],["stroke","#000"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",52],["y1",1.999999999999993],["x2",52],["y2",52.00000000000001]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",52],["cy",81],["r",106.96261028976434]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
