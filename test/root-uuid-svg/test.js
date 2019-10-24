var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",360],["fill","url(#karas-defs-1-0)"]]}],"children":[],"transform":[],"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",180],["y1",-2.842170943040401e-14],["x2",180],["y2",360]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-1-0"}]}')
      .end();
  }
};
