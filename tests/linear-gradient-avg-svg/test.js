var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",50],["fill","url(#karas-defs-0-0)"]]}],"type":"dom","children":[]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",55],["width",360],["height",50],["fill","url(#karas-defs-0-1)"]]}],"type":"dom","children":[]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",110],["width",360],["height",50],["fill","url(#karas-defs-0-2)"]]}],"type":"dom","children":[]}],"defs":[{"k":"linearGradient","c":[180,-2.1316282072803006e-14,180,50.00000000000002],"v":[["#0F0",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"k":"linearGradient","c":[180,54.99999999999998,180,105.00000000000003],"v":[["#0F0",0],["#000",0.5],["#00F",1]],"uuid":"karas-defs-0-1"},{"k":"linearGradient","c":[180,109.99999999999997,180,160.00000000000003],"v":[["#0F0",0],["#000",0.3333333333333333],["#F00",0.6666666666666666],["#00F",1]],"uuid":"karas-defs-0-2"}]}')
      .end();
  }
};
