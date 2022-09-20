let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L1,0L1,1L0,0M1,0L359,0L359,1L1,1M359,0L360,0L360,0L359,1" fill="rgba(0,0,0,1)"></path><path d="M360,0L360,0L360,1L359,1M359,1L360,1L360,201L359,201M359,201L360,201L360,202L360,202" fill="rgba(0,0,0,1)"></path><path d="M0,202L1,201L1,202L0,202M1,201L359,201L359,202L1,202M359,201L360,202L360,202L359,202" fill="rgba(0,0,0,1)"></path><path d="M0,0L0,0L1,1L0,1M0,1L1,1L1,201L0,201M0,201L1,201L0,202L0,202" fill="rgba(0,0,0,1)"></path></g><g><g visibility="visible"><g><path d="M1,1L359,1L359,201L1,201L1,1" fill="rgba(0,0,255,1)"></path></g><g><g visibility="visible"><g><path d="M1,1L359,1L359,181L1,181L1,1" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></g></g></g></g>')
      .end();
  }
};
