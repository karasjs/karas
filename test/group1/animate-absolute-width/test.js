let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:02:55.1465299Z ✔ Testing if value of element <input> equals '26.6953125/0/100' (21ms)'26.6953125/0/100' (21ms)'26.6953125/0/100' (21ms)'26.6953125/0/100' (21ms)')
      .end();
  }
};
