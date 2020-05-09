var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"ellipse","props":[["cx",50],["cy",25],["rx",50],["ry",25],["fill","url(#karas-defs-0-0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"ellipse","props":[["cx",50],["cy",75],["rx",50],["ry",25],["fill","url(#karas-defs-0-1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",50],["cy",25],["r",25]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",50],["cy",75],["r",55.90169943749474]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
