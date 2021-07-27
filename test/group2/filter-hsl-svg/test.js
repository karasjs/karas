let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L50,0L50,50L0,50L0,0"],["fill","rgba(255,153,51,1)"]]}],"children":[],"visibility":"visible","filter":"hue-rotate(30deg)","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,50L50,50L50,100L0,100L0,50"],["fill","rgba(255,153,51,1)"]]}],"children":[],"visibility":"visible","filter":"saturate(50%)","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,100L50,100L50,150L0,150L0,100"],["fill","rgba(255,153,51,1)"]]}],"children":[],"visibility":"visible","filter":"brightness(50%)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
