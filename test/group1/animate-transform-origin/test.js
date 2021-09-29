let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:06:10.3455292Z ✔ Testing if value of element <input> equals '13.34765625,9.19921875/0,0/26.6953125,18.3984375' (17ms)'13.34765625,9.19921875/0,0/26.6953125,18.3984375' (17ms)'13.34765625,9.19921875/0,0/26.6953125,18.3984375' (17ms)'13.34765625,9.19921875/0,0/26.6953125,18.3984375' (17ms)')
      .end();
  }
};
