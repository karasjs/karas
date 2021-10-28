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
