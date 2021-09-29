let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '9T06:14:10.8728702Z ✔ Testing if value of element <input> equals '100,0,0,0,1' (14ms)')
      .end();
  }
};
