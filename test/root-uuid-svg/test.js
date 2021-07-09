let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,360L0,360L0,0"],["fill","url(#karas-defs-2-0)"]]}],"children":[],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",180],["y1",0],["x2",180],["y2",360]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-2-0","index":0}]}')
      .end();
  }
};
