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
