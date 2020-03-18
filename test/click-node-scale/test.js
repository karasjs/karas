var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .moveToElement('canvas', 11, 11)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 11, 11)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .moveToElement('canvas', 101, 101)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
