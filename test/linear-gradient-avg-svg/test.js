var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",50],["fill","url(#karas-defs-0-0)"]]}],"children":[],"transform":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",55],["width",360],["height",50],["fill","url(#karas-defs-0-1)"]]}],"children":[],"transform":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",110],["width",360],["height",50],["fill","url(#karas-defs-0-2)"]]}],"children":[],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",180],["y1",-2.1316282072803006e-14],["x2",180],["y2",50.00000000000002]],"stop":[["#0F0",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",180],["y1",54.99999999999998],["x2",180],["y2",105.00000000000003]],"stop":[["#0F0",0],["#000",0.5],["#00F",1]],"uuid":"karas-defs-0-1"},{"tagName":"linearGradient","props":[["x1",180],["y1",109.99999999999997],["x2",180],["y2",160.00000000000003]],"stop":[["#0F0",0],["#000",0.3333333333333333],["#F00",0.6666666666666666],["#00F",1]],"uuid":"karas-defs-0-2"}]}')
      .end();
  }
};
