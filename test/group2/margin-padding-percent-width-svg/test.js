let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g visibility="visible"><g><path d="M3.6,3.6L110.8,3.6L110.8,110.8L3.6,110.8L3.6,3.6" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
