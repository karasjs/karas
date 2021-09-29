let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:22.0996689Z ✔ Testing if value of element <input> equals '1/0' (21ms)'1/0' (21ms)'1/0' (21ms)'1/0' (21ms)')
      .end();
  }
};
