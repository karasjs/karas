let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:01.4582638Z ✔ Testing if value of element <input> equals '10,20/100,200' (17ms)'10,20/100,200' (17ms)'10,20/100,200' (17ms)'10,20/100,200' (17ms)')
      .end();
  }
};
