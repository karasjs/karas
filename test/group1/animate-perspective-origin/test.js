let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', 'data:image/png;base64,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')
      .end();
  }
};
