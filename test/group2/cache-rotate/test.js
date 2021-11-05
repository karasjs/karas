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
