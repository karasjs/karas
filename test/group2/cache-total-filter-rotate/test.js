let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '9T06:07:39.8816807Z ✔ Testing if value of element <input> equals '' (20ms)')
      .end();
  }
};
