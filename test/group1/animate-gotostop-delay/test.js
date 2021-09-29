let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(30)
      .assert.value('input', '9T06:04:33.3303874Z ✔ Testing if value of element <input> equals 'none' (22ms)'none' (22ms)'none' (22ms)'none' (22ms)')
      .end();
  }
};
