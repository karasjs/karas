var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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')
      .end();
  }
};