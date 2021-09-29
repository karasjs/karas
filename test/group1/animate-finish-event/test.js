let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:06.9322000Z ✔ Testing if value of element <input> equals '/a0,0,0,1finish0/f0,0,0,1finish1finish2' (18ms)'/a0,0,0,1finish0/f0,0,0,1finish1finish2' (18ms)'/a0,0,0,1finish0/f0,0,0,1finish1finish2' (18ms)'/a0,0,0,1finish0/f0,0,0,1finish1finish2' (18ms)')
      .end();
  }
};
