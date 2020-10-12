let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",50],["height",50],["fill","url(#karas-defs-0-0)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",51],["width",50],["height",50],["fill","url(#karas-defs-0-1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",25],["cy",25],["r",35.35533905932738]],"children":[{"tagName":"stop","props":[["stop-color","rgba(42,212,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,255,0,1)"],["offset","20%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",25],["cy",76],["r",35.35533905932738]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,255,0,1)"],["offset","20%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,141,113,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
