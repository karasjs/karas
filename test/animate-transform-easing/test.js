var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 2000)
      .pause(500)
      .assert.value('input', 'true/true')
      .end();
  }
};
