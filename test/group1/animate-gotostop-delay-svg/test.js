let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(30)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible" transform="matrix(1,0,0,1,40,0)"><g></g><g></g></g></g>')
      .end();
  }
};
