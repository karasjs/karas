let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><g transform="matrix(1,0,0,1,94,234)" visibility="visible"><g><path d="M2.5,-39L102.5,-39L102.5,61L2.5,61L2.5,-39" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></g></g>')
      .end();
  }
};
