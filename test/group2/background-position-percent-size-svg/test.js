let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L100,0L100,100L0,100L0,0" fill="rgba(0,0,0,1)"></path><image xlink:href="../../image.png" x="0" y="0" width="100" height="100"></image></g><g></g></g><g visibility="visible"><g><path d="M0,100L50,100L50,150L0,150L0,100" fill="rgba(0,0,0,1)"></path><image xlink:href="../../image.png" x="0" y="100" width="100" height="100" transform="matrix(0.5,0,0,0.5,0,50)"></image></g><g></g></g><g visibility="visible"><g><path d="M0,150L200,150L200,350L0,350L0,150" fill="rgba(0,0,0,1)"></path><image xlink:href="../../image.png" x="0" y="150" width="100" height="100" transform="matrix(2,0,0,2,0,-150)"></image></g><g></g></g></g>')
      .end();
  }
};
