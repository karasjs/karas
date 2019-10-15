var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",50],["height",50],["fill","url(#karas-defs-0-0)"]]}],"children":[],"transform":[],"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",51],["width",50],["height",50],["fill","url(#karas-defs-0-1)"]]}],"children":[],"transform":[],"type":"dom"}],"transform":[],"type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",25],["cy",25],["r",35.35533905932738]],"stop":[["rgba(42,212,0,1)",0],["#0F0",0.2],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",25],["cy",76],["r",35.35533905932738]],"stop":[["#F00",0],["#0F0",0.2],["rgba(0,141,113,1)",1]],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
