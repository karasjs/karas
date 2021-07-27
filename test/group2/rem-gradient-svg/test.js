let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","url(#karas-defs-0-0)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,100L100,100L100,200L0,200L0,100"],["fill","url(#karas-defs-0-1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",0],["x2",50],["y2",100]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","16%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,257,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"radialGradient","props":[["cx",50],["cy",150],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","22.627416997969522%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,256,1)"],["offset","100%"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}]}')
      .end();
  }
};
