var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"k":"linear","v":[[[255,0,0,1]],[[0,0,255,1]]],"d":180}/{"k":"radial","v":[[[255,0,0,1]],[[0,0,255,1]]],"d":"farthest-corner"}')
      .end();
  }
};
