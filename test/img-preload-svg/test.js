var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g><g></g><g></g></g></g></svg>1<svg width="360" height="360"><defs></defs><g></g><g><g><g></g><g><image xlink:href="../image.png" x="0" y="0" width="100" height="100"></image></g></g></g></svg>')
      .end();
  }
};
