var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', 'linear-gradient(180deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 99%, rgba(255,255,255,1))/linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(0,0,255,1) 1%, rgba(255,255,255,1))')
      .end();
  }
};
