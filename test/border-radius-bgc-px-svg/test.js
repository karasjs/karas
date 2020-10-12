let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g visibility="visible"><g><path d="M0,30C0,13.431457505076192 13.431457505076192,0 30,0L90,0C95.52284749830794,0 100,4.477152501692064 100,10L100,80C100,91.04569499661588 91.04569499661588,100 80,100L40,100C17.908610006768257,100 0,82.09138999323174 0,60" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
