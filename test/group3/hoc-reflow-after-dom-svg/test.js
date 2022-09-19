let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(40)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L50,0L50,20L0,20L0,0" fill="rgba(0,0,0,1)"></path></g><g></g></g><g visibility="visible"><g><path d="M0,20L100,20L100,50L0,50L0,20" fill="rgba(255,0,0,1)"></path></g><g></g></g></g>')
      .end();
  }
};
