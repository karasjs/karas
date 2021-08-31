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