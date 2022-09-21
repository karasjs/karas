let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible" transform="matrix(0.5,0,0,0.5,25,25)"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(255,0,0,1)"></path></g><g></g></g><g transform="matrix(0.5,0,0,0.5,25,75)" visibility="visible"><g><path d="M0,100L100,100L100,200L0,200L0,100" fill="rgba(255,0,0,1)"></path></g><g></g></g><g visibility="visible" transform="matrix(0.5,0,0,0.5,35,135)"><g><path d="M0,200L100,200L100,300L0,300L0,200" fill="rgba(255,0,0,1)"></path></g><g></g></g></g>')
      .end();
  }
};
