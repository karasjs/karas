let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .moveToElement('svg', 1, 1)
      .mouseButtonClick(0)
      .pause(20)
      .assert.value('input', '9T06:04:35.0126153Z ✔ Testing if value of element <input> equals '1' (20ms)')
      .end();
  }
};
