let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g visibility="visible"><g><path d="M0,0L360,0L360,120L0,120L0,0" fill="rgba(0,0,0,1)"></path><image xlink:href="../../image.png" x="0" y="0" width="100" height="100" transform="matrix(3.6,0,0,1.2,0,0)"></image></g><g></g></g><g visibility="visible"><g><path d="M0,120L360,120L360,240L0,240L0,120" fill="rgba(0,255,0,1)"></path><image xlink:href="../../image.png" x="0" y="120" width="100" height="100" transform="matrix(0.5,0,0,0.8,0,24)"></image></g><g></g></g><g visibility="visible"><g><path d="M0,240L360,240L360,360L0,360L0,240" fill="rgba(0,0,255,1)"></path><image xlink:href="../../image.png" x="0" y="240" width="100" height="100" transform="matrix(0.5,0,0,0.5,0,120)"></image></g><g></g></g></g></svg>')
      .end();
  }
};
