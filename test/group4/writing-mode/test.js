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