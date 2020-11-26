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
