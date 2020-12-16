let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","mask":"url(#karas-defs-0-0)"}],"visibility":"visible","type":"dom","defs":[{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,360L0,360L0,0"],["fill","rgba(255,255,255,1)"],["stroke-width",0]]},{"type":"item","tagName":"path","props":[["d","M10,10L60,10L60,60L10,60L10,10"],["fill","rgba(0,0,0,1)"],["stroke-width",0],["transform","matrix(1,0,0,1,0,0)"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
