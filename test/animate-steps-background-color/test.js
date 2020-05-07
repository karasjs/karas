var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '/rgba(255,0,0,1)/rgba(170,0,85,1)/rgba(85,0,170,1)/rgba(0,0,0,0)')
      .end();
  }
};
