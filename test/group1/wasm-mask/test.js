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
