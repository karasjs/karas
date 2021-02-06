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
