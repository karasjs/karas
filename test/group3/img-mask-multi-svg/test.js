let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs><mask id="karas-defs-0-0"><path d="M0,0L100,0L50,100L0,0" fill="rgba(255,255,255,1)" stroke-width="0" transform="matrix(1,0,0,1,0,0)"></path></mask></defs><g></g><g><g visibility="visible" mask="url(#karas-defs-0-0)"><g></g><g><image xlink:href="../../image.png" x="0" y="0" width="100" height="100"></image></g></g></g>')
      .end();
  }
};
