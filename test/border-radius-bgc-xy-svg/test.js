let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g><g><path d="M0,10C0,4.477152501692064 22.38576250846032,0 50,0L50,0C77.61423749153968,0 100,4.477152501692064 100,10L100,45C100,47.76142374915397 95.52284749830794,50 90,50L10,50C4.477152501692064,50 0,45.52284749830794 0,40" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
