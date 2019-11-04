var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'matrix(1, 0, 0, 1, 0, 0)/matrix(1, 0, 0, 1, 10, 20)/matrix(1, 0, 0, 1, 50, 60)')
      .end();
  }
};
