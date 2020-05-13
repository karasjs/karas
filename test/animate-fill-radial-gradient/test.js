var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"k":"radial","v":[[[255,0,0,1],{"value":0,"unit":2}],[[0,0,255,1],{"value":99,"unit":2}],[[255,255,255,1]]],"d":"farthest-corner"}/{"k":"radial","v":[[[255,0,0,1],{"value":0,"unit":2}],[[0,0,255,1],{"value":1,"unit":2}],[[255,255,255,1]]],"d":"farthest-corner"}')
      .end();
  }
};
