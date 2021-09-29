let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:49.4551657Z ✔ Testing if value of element <input> equals '0/true' (18ms)'0/true' (18ms)'0/true' (18ms)'0/true' (18ms)')
      .end();
  }
};
