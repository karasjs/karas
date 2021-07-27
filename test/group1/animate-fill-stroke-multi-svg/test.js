let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '[[255,0,0,1],{"k":"linear","d":180,"v":[[[255,0,0,0.5]],[[0,0,255,0.5]]]}]/[[255,0,0,1],[0,0,255,1]]|[[0,0,255,1],{"k":"linear","d":180,"v":[[[0,0,255,0.5]],[[255,0,0,0.5]]]}]/[[0,0,255,1],[255,0,0,1]]')
      .end();
  }
};
