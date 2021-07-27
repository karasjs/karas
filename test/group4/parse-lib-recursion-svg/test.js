let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,120L0,120L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L110,10L110,110L10,110L10,10"],["fill","rgba(0,255,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M110,10L210,10L210,110L110,110L110,10"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
