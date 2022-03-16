let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L1,0L1,1L0,0M1,0L359,0L359,1L1,1M359,0L360,0L360,0L359,1"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M360,0L360,0L360,1L359,1M359,1L360,1L360,65L359,65M359,65L360,65L360,66L360,66"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,66L1,65L1,66L0,66M1,65L359,65L359,66L1,66M359,65L360,66L360,66L359,66"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L0,0L1,1L0,1M0,1L1,1L1,65L0,65M0,65L1,65L0,66L0,66"],["fill","rgba(0,0,0,1)"]]}],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M1,1L65,1L65,65L1,65L1,1"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
