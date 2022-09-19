let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(40)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><image xlink:href="../../image.png" x="0" y="0" width="100" height="100"></image></g></g><g visibility="visible"><g></g><g><g><text x="100" y="100" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">1</text></g></g></g></g>')
      .end();
  }
};
