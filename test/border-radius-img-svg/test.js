var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><mask id="karas-defs-0-0" maskUnits="userSpaceOnUse"><path d="M0,0L90,0C95.52284749830794,0,100,4.477152501692064,100,10L100,90C100,95.52284749830794,95.52284749830794,100,90,100L10,100C4.477152501692064,100,0,95.52284749830794,0,90L0,10C0,4.477152501692064,4.477152501692064,0,10,0" fill="#FFF"></path></mask></defs><g></g><g><g><g></g><g><image xlink:href="../image.png" x="0" y="0" width="100" height="100" mask="url(#karas-defs-0-0)"></image></g></g></g></svg>')
      .end();
  }
};
