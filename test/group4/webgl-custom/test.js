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
