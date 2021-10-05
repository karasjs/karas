let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible" transform="matrix(1,0,0,1,100,75)"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(255,0,0,1)"></path></g><g></g></g><g visibility="visible" transform="matrix(1,0,0,1,200,0)"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(0,255,0,1)"></path></g><g></g></g><g visibility="visible"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(0,0,255,1)"></path></g><g></g></g></g>')
      .end();
  }
};
