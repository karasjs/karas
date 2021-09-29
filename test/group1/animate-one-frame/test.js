let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:05:22.6789405Z ✔ Testing if value of element <input> equals '100/100' (16ms)'100/100' (16ms)'100/100' (16ms)'100/100' (16ms)')
      .end();
  }
};
