let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(200)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"img","tagName":"image","props":[["xlink:href","../../logo.png"],["x",100],["y",100],["width",128],["height",128],["clip-path","url(#karas-defs-0-0)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M100,100L200,100L200,200L100,200L100,100"],["fill","#FFF"]]}],"id":0,"uuid":"karas-defs-0-0","index":0}],"lv":1}')
      .end();
  }
};
