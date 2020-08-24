var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><clipPath id="karas-defs-0-0"><path d="M100,110C100,104.47715250169206 104.47715250169206,100 110,100L170,100C175.52284749830793,100 180,104.47715250169206 180,110L180,150C180,155.52284749830793 175.52284749830793,160 170,160L110,160C104.47715250169206,160 100,155.52284749830793 100,150" fill="#FFF"></path></clipPath></defs><g></g><g><g><g></g><g clip-path="url(#karas-defs-0-0)"><image xlink:href="../image.png" x="100" y="100" width="100" height="100" transform="matrix(0.8,0,0,0.6,20,40)"></image></g></g></g></svg>')
      .end();
  }
};
