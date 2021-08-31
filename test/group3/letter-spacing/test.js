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