let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><path d="M0,50C0,22.38576250846032 22.38576250846032,0 50,0C77.61423749153968,0 100,22.38576250846032 100,50C100,77.61423749153968 77.61423749153968,100 50,100C22.38576250846032,100 0,77.61423749153968 0,50" fill="none" stroke="rgba(0,0,0,1)" stroke-width="1"></path></g></g><g visibility="visible"><g></g><g><g><text x="100" y="100" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">1</text></g></g></g></g>')
      .end();
  }
};
