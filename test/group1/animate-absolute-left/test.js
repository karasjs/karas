let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:02:52.9656396Z ✔ Testing if value of element <input> equals '0/100' (20ms)'0/100' (20ms)'0/100' (20ms)'0/100' (20ms)')
      .end();
  }
};
