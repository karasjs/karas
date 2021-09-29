let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:33.4251696Z ✔ Testing if value of element <input> equals 'true' (24ms)'true' (24ms)'true' (24ms)'true' (24ms)')
      .end();
  }
};
