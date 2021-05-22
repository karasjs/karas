let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L10,0L10,10L0,10L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","transform":"matrix(1,0,0,1,160,0)","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,10L10,10L10,20L0,20L0,10"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","transform":"matrix(1,0,0,1,0,32)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
