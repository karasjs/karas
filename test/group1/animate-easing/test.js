let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:44.4021389Z ✔ Testing if value of element <input> equals 'cubic-bezier(0, 1, 0, 1)/cubic-bezier(1, 0, 1, 0)' (18ms)'cubic-bezier(0, 1, 0, 1)/cubic-bezier(1, 0, 1, 0)' (18ms)'cubic-bezier(0, 1, 0, 1)/cubic-bezier(1, 0, 1, 0)' (18ms)'cubic-bezier(0, 1, 0, 1)/cubic-bezier(1, 0, 1, 0)' (18ms)')
      .end();
  }
};
