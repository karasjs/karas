var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g><g><rect x="100" y="100" width="50" height="50" fill="rgba(0,0,255,1)"></rect></g><g></g></g><g><g><rect x="200" y="200" width="50" height="50" fill="rgba(0,0,255,1)"></rect></g><g></g></g></g></svg>')
      .end();
  }
};
