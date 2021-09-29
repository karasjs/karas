let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 2000)
      .pause(300)
      .assert.value('input', '9T06:05:20.7450261Z ✔ Testing if value of element <input> equals 'true/true/true' (1058ms)'true/true/true' (1058ms)'true/true/true' (1058ms)'true/true/true' (1058ms)')
      .end();
  }
};
