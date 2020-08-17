var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"type":"dom","opacity":1,"children":[{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",0],["y",0],["width",100],["height",100],["transform","matrix(1,0,0,2,0,0)"]]}],"bb":[]}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
