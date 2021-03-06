let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .moveToElement('canvas', 21, 5)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 70, 5)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 100, 50)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .end();
  }
};
