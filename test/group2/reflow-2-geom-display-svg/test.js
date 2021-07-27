let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(255,0,0,1)"></path></g><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="none" stroke="rgba(0,0,0,1)" stroke-width="1"></path></g></g><g visibility="visible"><g><path d="M0,100L100,100L100,200L0,200L0,100" fill="rgba(0,0,255,1)"></path></g><g><path d="M0,100L100,200" fill="none" stroke="rgba(0,0,0,1)" stroke-width="1"></path></g></g></g>')
      .end();
  }
};
