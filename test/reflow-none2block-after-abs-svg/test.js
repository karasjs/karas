let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs><filter id="karas-defs-0-0" x="-0.13" y="-0.13" width="1.26" height="1.26"><feGaussianBlur stdDeviation="2"></feGaussianBlur></filter></defs><g></g><g><g visibility="visible"><g></g><g><g><text x="0" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">a</text></g></g></g><g visibility="visible"><g></g><g><g><text x="0" y="32.8828125" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">b</text></g></g></g><g visibility="visible" filter="url(#karas-defs-0-0)"><g><path d="M100,100L200,100L200,200L100,200L100,100" fill="rgba(255,0,0,1)"></path></g><g><g><text x="100" y="114.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">123</text></g></g></g></g>')
      .end();
  }
};
