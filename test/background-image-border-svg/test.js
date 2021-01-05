let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M100,100L105,100L105,105L100,100M105,100L155,100L155,105L105,105M155,100L160,100L160,100L155,105"],["fill","rgba(0,255,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M160,100L160,100L160,105L155,105M155,105L160,105L160,155L155,155M155,155L160,155L160,160L160,160"],["fill","rgba(0,255,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M100,160L105,155L105,160L100,160M105,155L155,155L155,160L105,160M155,155L160,160L160,160L155,160"],["fill","rgba(0,255,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M100,100L100,100L105,105L100,105M100,105L105,105L105,155L100,155M100,155L105,155L100,160L100,160"],["fill","rgba(0,255,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
