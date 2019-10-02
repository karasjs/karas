var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"circle","props":[["cx",25],["cy",25],["r",25],["fill","url(#karas-defs-0-1)"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"circle","props":[["cx",25],["cy",75],["r",12.5],["fill","url(#karas-defs-0-3)"],["stroke","url(#karas-defs-0-2)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",25],["y1",11.999999999999998],["x2",25],["y2",38]],"stop":[["#0F0",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",25],["cy",25],["r",35.35533905932738]],"stop":[["#F00",0],["#000",1]],"uuid":"karas-defs-0-1"},{"tagName":"linearGradient","props":[["x1",25],["y1",68.25],["x2",25],["y2",81.75]],"stop":[["#0F0",0],["#00F",1]],"uuid":"karas-defs-0-2"},{"tagName":"radialGradient","props":[["cx",25],["cy",75],["r",17.67766952966369]],"stop":[["#F00",0],["#000",1]],"uuid":"karas-defs-0-3"}]}')
      .end();
  }
};
