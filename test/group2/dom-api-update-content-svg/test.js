let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><g visibility="visible"><g></g><g><g><text x="157.75388" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">haha</text></g></g></g><g visibility="visible"><g></g><g><g><text x="193.34768000000003" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">b</text></g></g></g></g></g></g>')
      .end();
  }
};
