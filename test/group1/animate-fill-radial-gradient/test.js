let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '{"k":"radial","s":"ellipse","z":"farthest-corner","p":[[50,2],[50,2]],"v":[[[255,0,0,1],[0,2]],[[0,0,255,1],[99,2]],[[255,255,255,1]]]}/{"k":"radial","s":"ellipse","z":"farthest-corner","p":[[50,2],[50,2]],"v":[[[255,0,0,1],[0,2]],[[0,0,255,1],[1,2]],[[255,255,255,1]]]}')
      .end();
  }
};
