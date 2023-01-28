let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(220)
      .assert.value('input', '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1/true/1,0,0,0,0,1,0,0,0,0,1,0,100,0,0,1')
      .end();
  }
};
