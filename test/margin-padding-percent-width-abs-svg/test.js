let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g visibility="visible"><g><rect x="3.6" y="3.6" width="107.2" height="107.2" fill="rgba(255,0,0,1)"></rect></g><g></g></g></g></svg>')
      .end();
  }
};
