let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g><g><rect x="100" y="100" width="50" height="50" fill="rgba(0,0,255,1)"></rect><image xlink:href="../image.png" x="100" y="100" width="100" height="100" transform="matrix(0.5,0,0,0.5,50,50)"></image></g><g></g></g><g><g><rect x="200" y="200" width="50" height="50" fill="rgba(0,0,255,1)"></rect><image xlink:href="../image.png" x="200" y="200" width="100" height="100" transform="matrix(0.5,0,0,0.5,100,100)"></image></g><g></g></g></g></svg>')
      .end();
  }
};
