var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",180],["height",180],["fill","rgba(0,0,0,1)"]]}],"children":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",10],["y",190],["width",180],["height",180],["fill","#0f0"]]}],"children":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",20],["y",20],["width",180],["height",180],["fill","#00f"]]}],"children":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",30],["y",30],["width",180],["height",180],["fill","#f00"]]}],"children":[],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
