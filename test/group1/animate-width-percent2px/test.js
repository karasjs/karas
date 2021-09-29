let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:06:16.2541651Z ✔ Testing if value of element <input> equals '72/200' (16ms)'72/200' (16ms)'72/200' (16ms)'72/200' (16ms)')
      .end();
  }
};
