let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(0,0,255,1)"></path></g><g><g><text x="0" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">haha</text></g><g visibility="visible"><g></g><g><g><text x="35.5938" y="14.484375" fill="rgba(0,255,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">b</text></g></g></g></g></g></g>')
      .end();
  }
};
