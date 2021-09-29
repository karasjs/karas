let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:36.2465809Z ✔ Testing if value of element <input> equals 'none' (19ms)'none' (19ms)'none' (19ms)'none' (19ms)')
      .end();
  }
};
