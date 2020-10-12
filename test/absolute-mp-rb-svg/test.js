let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",160],["y",160],["width",200],["height",200],["fill","rgba(255,0,0,1)"]]}],"children":[],"type":"dom"}],"type":"dom","defs":[]}')
      .end();
  }
};
