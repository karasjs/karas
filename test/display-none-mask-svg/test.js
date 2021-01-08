let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(0,0,255,1)"></path></g><g><g visibility="visible"><g></g><g></g></g></g></g></g>')
      .end();
  }
};
