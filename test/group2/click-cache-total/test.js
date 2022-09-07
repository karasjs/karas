let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .moveToElement('canvas', 121, 21)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 131, 241)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
