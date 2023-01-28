let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '{"k":"linear","d":90,"v":[[[255,0,0,1],{"v":0,"u":2}],[[0,0,255,1],{"v":1,"u":2}],[[255,255,255,1]]]}')
      .end();
  }
};
