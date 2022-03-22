let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M25.09970000000067,0L51.80280000000067,0L51.80280000000067,18.3984375L25.09970000000067,18.3984375L25.09970000000067,0" fill="rgba(255,0,0,1)"></path></g><g><g><text x="25.09970000000067" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">123</text></g></g></g></g>')
      .end();
  }
};
