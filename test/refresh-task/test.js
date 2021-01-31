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
      .assert.value('input', '1')
      .end();
  }
};
