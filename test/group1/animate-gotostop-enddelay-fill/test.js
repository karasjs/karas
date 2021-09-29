let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:34.3925045Z ✔ Testing if value of element <input> equals 'block' (18ms)'block' (18ms)'block' (18ms)'block' (18ms)')
      .end();
  }
};
