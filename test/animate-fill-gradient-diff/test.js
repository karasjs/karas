let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"k":"linear","d":180,"v":[[[255,0,0,1]],[[0,0,255,1]]]}/{"k":"radial","s":"circle","z":"farthest-corner","p":[{"value":50,"unit":2},{"value":50,"unit":2}],"v":[[[255,0,0,1]],[[0,0,255,1]]]}')
      .end();
  }
};
