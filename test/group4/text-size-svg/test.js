let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '175.546875,8.90625,95.546875,8.90625,175.546875,8.90625')
      .end();
  }
};
