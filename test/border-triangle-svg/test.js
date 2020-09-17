let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L50,0L50,50L0,0M50,0L50,0L50,50L50,50M50,0L100,0L100,0L50,50"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M100,0L100,0L100,50L50,50M50,50L100,50L100,50L50,50M50,50L100,50L100,100L100,100"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,100L50,50L50,100L0,100M50,50L50,50L50,100L50,100M50,50L100,100L100,100L50,100"],["fill","rgba(153,153,153,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L0,0L50,50L0,50M0,50L50,50L50,50L0,50M0,50L50,50L0,100L0,100"],["fill","rgba(0,0,255,1)"]]}],"children":[],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,100L50,100L50,150L0,100M50,100L60,100L60,150L50,150M60,100L110,100L110,100L60,150"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M110,100L110,100L110,150L60,150M60,150L110,150L110,160L60,160M60,160L110,160L110,210L110,210"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,210L50,160L50,210L0,210M50,160L60,160L60,210L50,210M60,160L110,210L110,210L60,210"],["fill","rgba(153,153,153,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,100L0,100L50,150L0,150M0,150L50,150L50,160L0,160M0,160L50,160L0,210L0,210"],["fill","rgba(0,0,255,1)"]]}],"children":[],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
