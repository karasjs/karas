let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:08.0446127Z ✔ Testing if value of element <input> equals '16,32/30,90' (16ms)'16,32/30,90' (16ms)'16,32/30,90' (16ms)'16,32/30,90' (16ms)')
      .end();
  }
};
