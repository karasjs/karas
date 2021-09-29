let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:29.9434554Z ✔ Testing if value of element <input> equals '200/200' (17ms)'200/200' (17ms)'200/200' (17ms)'200/200' (17ms)')
      .end();
  }
};
