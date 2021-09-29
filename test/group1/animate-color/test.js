let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:31.2870161Z ✔ Testing if value of element <input> equals '255,0,0,1/0,0,0,1' (17ms)'255,0,0,1/0,0,0,1' (17ms)'255,0,0,1/0,0,0,1' (17ms)'255,0,0,1/0,0,0,1' (17ms)')
      .end();
  }
};
