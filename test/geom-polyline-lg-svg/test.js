var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["fill","none"],["stroke","#000"],["points","20,40 80,25 50,10"]]}],"transform":[]"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["fill","none"],["stroke","url(#karas-defs-0-0)"],["points","20,60 80,90 50,90"]]}],"transform":[]"opacity":1,"type":"geom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",49.99999999999999],["x2",50],["y2",100]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
