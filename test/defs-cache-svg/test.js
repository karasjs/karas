let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><linearGradient id="karas-defs-0-0" gradientUnits="userSpaceOnUse" x1="180" y1="0" x2="180" y2="50"><stop stop-color="rgba(255,0,0,1)" offset="0%"></stop><stop stop-color="rgba(0,0,255,1)" offset="100%"></stop></linearGradient></defs><g></g><g><g visibility="visible" opacity="0.5"><g><path d="M0,0L360,0L360,50L0,50L0,0" fill="url(#karas-defs-0-0)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
