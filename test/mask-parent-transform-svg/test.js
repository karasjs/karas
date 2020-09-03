var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><mask id="karas-defs-0-0"><path d="M50,100L100,150L50,150L50,100" fill="rgba(255,255,255,1)" stroke="rgba(0,0,0,1)" stroke-width="0"></path></mask></defs><g></g><g><g transform="matrix(1,0,0,1,50,0)"><g></g><g><g mask="url(#karas-defs-0-0)"><g><rect x="0" y="0" width="360" height="360" fill="rgba(255,0,0,1)"></rect></g><g><g><text x="0" y="14.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">123</text></g></g></g></g></g></g></svg>')
      .end();
  }
};
