let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:06:00.3400238Z ✔ Testing if value of element <input> equals '/255,0,0,1/170,0,85,1/85,0,170,1/0,0,0,0' (20ms)'/255,0,0,1/170,0,85,1/85,0,170,1/0,0,0,0' (20ms)'/255,0,0,1/170,0,85,1/85,0,170,1/0,0,0,0' (20ms)'/255,0,0,1/170,0,85,1/85,0,170,1/0,0,0,0' (20ms)')
      .end();
  }
};
