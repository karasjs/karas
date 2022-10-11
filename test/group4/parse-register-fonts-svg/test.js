let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><g><text x="0" y="62.459999999999994" fill="rgba(0,0,0,1)" font-family="alipay" font-weight="400" font-style="normal" font-size="60px">123</text></g></g></g></g>')
      .end();
  }
};
