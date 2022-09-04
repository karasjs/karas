let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '[{"k":"saturate","v":360}]/false/[{"k":"saturate","v":180}]')
      .end();
  }
};
