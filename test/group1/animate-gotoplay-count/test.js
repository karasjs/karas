let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:26.7143098Z ✔ Testing if value of element <input> equals '200/true/200' (18ms)'200/true/200' (18ms)'200/true/200' (18ms)'200/true/200' (18ms)')
      .end();
  }
};
