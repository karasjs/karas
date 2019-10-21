var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"circle","props":[["cx",25],["cy",25],["r",25],["fill","url(#karas-defs-0-0)"],["stroke","#000"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"circle","props":[["cx",25],["cy",75],["r",12.5],["fill","url(#karas-defs-0-1)"],["stroke","#000"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",25],["cy",25],["r",35.35533905932738]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",25],["cy",75],["r",79.05694150420949]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
