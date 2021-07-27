let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(50)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><image xlink:href="../logo.png" x="0" y="0" width="128" height="128"></image></g></g></g>')
      .end();
  }
};
