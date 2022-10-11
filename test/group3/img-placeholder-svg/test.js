let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g></g></g></g>32768<defs></defs><g></g><g><g visibility="visible"><g></g><g><image xlink:href="../../image.png" x="0" y="0" width="100" height="100"></image></g></g></g>')
      .end();
  }
};
