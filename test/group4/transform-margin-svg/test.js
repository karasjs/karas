let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M100,0L200,0L200,100L100,100L100,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","transform":"matrix(-1,0,0,1,300,0)","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M100,100L200,100L200,200L100,200L100,100"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
