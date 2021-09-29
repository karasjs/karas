let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(100)
      .assert.value('input', '9T06:11:59.0725971Z ✔ Testing if value of element <input> equals '123100' (18ms)')
      .end();
  }
};
