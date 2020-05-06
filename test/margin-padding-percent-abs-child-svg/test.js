var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g><g><rect x="3.6" y="3.6" width="107.19999999999996" height="87.19999999999999" fill="rgba(255,0,0,1)"></rect></g><g><g><g><rect x="7.2" y="7.2" width="100" height="80" fill="rgba(0,0,255,1)"></rect></g><g></g></g></g></g></g></svg>')
      .end();
  }
};
