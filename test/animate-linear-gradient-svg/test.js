var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","url(#karas-defs-0-2)"]]}],"children":[],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",-7.105427357601002e-15],["x2",50],["y2",100]],"stop":[["rgb(255,0,0)",0],["rgb(0,0,255)",0.99],["rgb(255,255,255)",1]],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",0],["y1",50],["x2",100],["y2",50]],"stop":[["rgb(255,0,0)",0],["rgb(0,0,255)",0.01],["rgb(255,255,255)",1]],"uuid":"karas-defs-0-1"},{"tagName":"linearGradient","props":[["x1",0],["y1",50],["x2",100],["y2",50]],"stop":[["rgb(255,0,0)",0],["rgb(0,0,255)",0.01],["rgb(255,255,255)",1]],"uuid":"karas-defs-0-2"}]}')
      .end();
  }
};
