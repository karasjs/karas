let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', 'data:image/png;base64,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')
      .pause(150)
      .assert.value('input', 'data:image/png;base64,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')
      .end();
  }
};
