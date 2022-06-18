let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(200)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible" transform="matrix(1,0,0,1,100,0)"><g></g><g><g><text x="0" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">a</text></g></g></g><g visibility="visible"><g></g><g><g><text x="8.90625" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">b</text></g></g></g></g>')
      .end();
  }
};
