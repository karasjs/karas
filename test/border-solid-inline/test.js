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
