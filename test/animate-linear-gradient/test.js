var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'linear-gradient(180deg, rgb(255,0,0) 0%, rgb(0,0,255) 99%, rgb(255,255,255))/linear-gradient(90deg, rgb(255,0,0) 0%, rgb(0,0,255) 1%, rgb(255,255,255))')
      .end();
  }
};
