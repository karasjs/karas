let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M180,180L211.59375,180L211.59375,202.3984375L180,202.3984375L180,180" fill="rgba(204,204,204,1)"></path></g><g><g visibility="visible"><g></g><g><g visibility="visible"><g></g><g><g><text x="182" y="196.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="700" font-style="normal" font-size="16px">abc</text></g></g></g></g></g></g></g></g>')
      .end();
  }
};
