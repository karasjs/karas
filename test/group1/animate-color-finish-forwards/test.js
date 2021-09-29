let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:14.4590383Z ✔ Testing if value of element <input> equals '0,0,255,1/1' (19ms)'0,0,255,1/1' (19ms)'0,0,255,1/1' (19ms)'0,0,255,1/1' (19ms)')
      .end();
  }
};
