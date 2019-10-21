var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 500)
      .moveToElement('svg', 1, 1)
      .mouseButtonClick(0)
      .pause(100)
      .assert.value('input', '3')
      .end();
  }
};
