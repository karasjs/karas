let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:18.7475004Z ✔ Testing if value of element <input> equals '0,0.2,0.8,1/0,0.3,0.7,1' (21ms)'0,0.2,0.8,1/0,0.3,0.7,1' (21ms)'0,0.2,0.8,1/0,0.3,0.7,1' (21ms)'0,0.2,0.8,1/0,0.3,0.7,1' (21ms)')
      .end();
  }
};
