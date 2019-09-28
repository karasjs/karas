var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",50],["fill","url(#karas-defs-0-0)"]]}],"type":"dom","children":[]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",55],["width",360],["height",50],["fill","url(#karas-defs-0-1)"]]}],"type":"dom","children":[]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",110],["width",360],["height",50],["fill","url(#karas-defs-0-2)"]]}],"type":"dom","children":[]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",165],["width",360],["height",50],["fill","url(#karas-defs-0-3)"]]}],"type":"dom","children":[]}],"defs":[{"k":"linearGradient","c":[180,-2.1316282072803006e-14,180,50.00000000000002],"v":[["#0F0",0.1],["#F00",0.55],["#00F",1]],"uuid":"karas-defs-0-0"},{"k":"linearGradient","c":[1.152412337697399,48.46434486051366,358.8475876623026,111.53565513948634],"v":[["#F00",0.13766019518134454],["#00F",1]],"uuid":"karas-defs-0-1"},{"k":"linearGradient","c":[209.0908452403737,55.073559589224246,150.9091547596263,214.92644041077574],"v":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-2"},{"k":"linearGradient","c":[325.8253175473055,274.1922863405995,34.174682452694526,105.8077136594005],"v":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-3"}]}')
      .end();
  }
};
