var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0 0 L100 100"],["fill","none"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0 100 C20 150 80 150 100 200"],["fill","none"],["stroke","url(#karas-defs-0-1)"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0 200 L100 300"],["fill","none"],["stroke","url(#karas-defs-0-2)"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M40 340 L50 350"],["fill","none"],["stroke","url(#karas-defs-0-3)"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",-7.105427357601002e-15],["x2",50],["y2",100]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",50],["y1",100],["x2",50],["y2",200]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-1"},{"tagName":"linearGradient","props":[["x1",50],["y1",200],["x2",50],["y2",300]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-2"},{"tagName":"linearGradient","props":[["x1",50],["y1",300],["x2",50],["y2",400]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-3"}]}')
      .end();
  }
};
