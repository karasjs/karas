let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '<svg width="360" height="360"><defs><clipPath id="karas-defs-0-0"><path d="M100,100L200,100L200,130L100,130L100,100" fill="#FFF"></path></clipPath><clipPath id="karas-defs-0-1"><path d="M100,200L200,200L200,230L100,230L100,200" fill="#FFF"></path></clipPath></defs><g></g><g><g visibility="visible"><g></g><g><g visibility="visible"><g><image xlink:href="../image.png" x="100" y="100" width="100" height="100" clip-path="url(#karas-defs-0-0)"></image></g><g></g></g></g></g><g visibility="visible" opacity="0.5"><g><image xlink:href="../image.png" x="100" y="200" width="100" height="100" clip-path="url(#karas-defs-0-1)"></image></g><g></g></g></g></svg>')
      .end();
  }
};
