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
