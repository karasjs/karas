let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .moveToElement('svg', 60, 60)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 40, 40)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 160, 160)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 140, 140)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
