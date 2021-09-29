let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:06:14.1882882Z ✔ Testing if value of element <input> equals '26.6953125/26.6953125/200' (20ms)'26.6953125/26.6953125/200' (20ms)'26.6953125/26.6953125/200' (20ms)'26.6953125/26.6953125/200' (20ms)')
      .end();
  }
};
