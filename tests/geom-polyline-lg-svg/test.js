var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["points","20,40 80,25 50,10 "],["fill","none"],["stroke","#000"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["points","20,60 80,90 50,90 "],["fill","none"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",0],["y1",24.999999999999993],["x2",0],["y2",75]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
