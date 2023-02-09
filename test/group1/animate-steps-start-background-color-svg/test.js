let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '/170,0,85,1/85,0,170,1/0,0,255,1/0,0,0,0')
      .end();
  }
};
