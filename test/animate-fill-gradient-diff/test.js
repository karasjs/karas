var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', 'linear-gradient(180deg, rgb(255,0,0,1), rgb(0,0,255,1))/radial-gradient(farthest-corner, rgb(255,0,0,1), rgb(0,0,255,1))')
      .end();
  }
};
