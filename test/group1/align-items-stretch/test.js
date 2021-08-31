let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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')
      .end();
  }
};