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
