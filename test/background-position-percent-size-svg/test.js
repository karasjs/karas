let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g><g><rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,1)"></rect><image xlink:href="../image.png" x="0" y="0" width="100" height="100"></image></g><g></g></g><g><g><rect x="0" y="100" width="50" height="50" fill="rgba(0,0,0,1)"></rect><image xlink:href="../image.png" x="0" y="100" width="100" height="100" transform="matrix(0.5,0,0,0.5,0,50)"></image></g><g></g></g><g><g><rect x="0" y="150" width="200" height="200" fill="rgba(0,0,0,1)"></rect><image xlink:href="../image.png" x="0" y="150" width="100" height="100" transform="matrix(2,0,0,2,0,-150)"></image></g><g></g></g></g></svg>')
      .end();
  }
};
