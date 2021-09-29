let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:09.2009736Z ✔ Testing if value of element <input> equals '16,18.3984375/60,68.994140625' (19ms)'16,18.3984375/60,68.994140625' (19ms)'16,18.3984375/60,68.994140625' (19ms)'16,18.3984375/60,68.994140625' (19ms)')
      .end();
  }
};
