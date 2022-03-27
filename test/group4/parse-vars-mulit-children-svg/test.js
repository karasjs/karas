let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible" transform="matrix(1,0,0,1,100,0)"><g></g><g><g><text x="0" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">200</text></g><g><text x="26.7031" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">abc</text></g></g></g></g>')
      .end();
  }
};
