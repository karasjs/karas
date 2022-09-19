let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(250)
      .assert.value('input', '[{"k":"hueRotate","v":0}]/[{"k":"hueRotate","v":30}]')
      .end();
  }
};
