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
