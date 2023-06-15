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
