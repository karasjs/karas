let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g visibility="visible"><g><path d="M3.6,3.6L110.79999999999998,3.6L110.79999999999998,90.8L3.6,90.8L3.6,3.6" fill="rgba(255,0,0,1)"></path></g><g><g visibility="visible"><g><path d="M7.2,7.2L107.2,7.2L107.2,87.2L7.2,87.2L7.2,7.2" fill="rgba(0,0,255,1)"></path></g><g></g></g></g></g></g></svg>')
      .end();
  }
};
