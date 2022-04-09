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
