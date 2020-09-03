var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M2,2L102,2L102,52L2,52L2,2"],["fill","url(#karas-defs-0-0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M2,56L102,56L102,106L2,106L2,56"],["fill","url(#karas-defs-0-1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",52],["y1",1.999999999999993],["x2",52],["y2",52.00000000000001]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",52],["cy",81],["r",55.90169943749474]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
