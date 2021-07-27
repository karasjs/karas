let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","url(#karas-defs-0-0)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","url(#karas-defs-0-1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",0],["x2",50],["y2",100]],"children":[{"tagName":"stop","props":[["stop-color","rgba(0,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,0,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"linearGradient","props":[["x1",50],["y1",0],["x2",50],["y2",100]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,0)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","100%"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}]}')
      .end();
  }
};
