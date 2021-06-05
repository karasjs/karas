let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs><clipPath id="karas-defs-0-0"><path d="M0,10C0,4.477152501692064 4.477152501692064,0 10,0L90,0C95.52284749830794,0 100,4.477152501692064 100,10L100,90C100,95.52284749830794 95.52284749830794,100 90,100L10,100C4.477152501692064,100 0,95.52284749830794 0,90" fill="#FFF"></path></clipPath></defs><g></g><g><g visibility="visible"><g></g><g clip-path="url(#karas-defs-0-0)"><image xlink:href="../image.png" x="0" y="0" width="100" height="100"></image></g></g></g>')
      .end();
  }
};
