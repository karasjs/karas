var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0 0 L100 100"],["fill","none"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0 100 C20 150 80 150 100 200"],["fill","none"],["stroke","url(#karas-defs-0-1)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0 200 L100 300"],["fill","none"],["stroke","url(#karas-defs-0-2)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M40 340 L50 350"],["fill","none"],["stroke","url(#karas-defs-0-3)"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",0],["y1",-50.00000000000001],["x2",0],["y2",50.00000000000001]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",0],["y1",49.99999999999999],["x2",0],["y2",150]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-1"},{"tagName":"linearGradient","props":[["x1",0],["y1",150],["x2",0],["y2",250]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-2"},{"tagName":"linearGradient","props":[["x1",0],["y1",250],["x2",0],["y2",350]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-3"}]}')
      .end();
  }
};
