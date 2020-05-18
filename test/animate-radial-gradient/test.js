var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"k":"radial","s":"circle","z":"farthest-corner","p":[{"value":0,"unit":2},{"value":0,"unit":2}],"v":[[[255,0,0,1],{"value":0,"unit":2}],[[0,0,255,1],{"value":99,"unit":2}],[[255,255,255,1]]]}/{"k":"radial","s":"circle","z":"farthest-corner","p":[{"value":100,"unit":2},{"value":100,"unit":2}],"v":[[[255,0,0,1],{"value":0,"unit":2}],[[0,0,255,1],{"value":1,"unit":2}],[[255,255,255,1]]]}')
      .end();
  }
};
