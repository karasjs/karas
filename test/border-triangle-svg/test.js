var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L50,50L50,50"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M50,50L100,0L100,100L50,50"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M50,50L50,50L100,100L0,100"],["fill","rgba(153,153,153,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L50,50L50,50L0,100"],["fill","rgba(0,0,255,1)"]]}],"children":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,100L110,100L60,150L50,150"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M60,150L110,100L110,210L60,160"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M50,160L60,160L110,210L0,210"],["fill","rgba(153,153,153,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,100L50,150L50,160L0,210"],["fill","rgba(0,0,255,1)"]]}],"children":[],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
