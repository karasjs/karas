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
