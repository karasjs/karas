var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","url(#karas-defs-0-0)"]]}],"children":[],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",0],["y1",50],["x2",100],["y2",50]],"children":[{"tagName":"stop","props":[["stop-color","rgb(255,0,0)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgb(0,0,255)"],["offset","1%"]]},{"tagName":"stop","props":[["stop-color","rgb(255,255,255)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
