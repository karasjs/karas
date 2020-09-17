let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', 'cubic-bezier(0, 1, 0, 1)/cubic-bezier(1, 0, 1, 0)')
      .end();
  }
};
