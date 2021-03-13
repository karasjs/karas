let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<svg width="200" height="200"><defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L140,0L140,140L0,140L0,0" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
