let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:48.4878821Z ✔ Testing if value of element <input> equals '/begin/end/begin/end/fin' (535ms)'/begin/end/begin/end/fin' (535ms)'/begin/end/begin/end/fin' (535ms)'/begin/end/begin/end/fin' (535ms)')
      .end();
  }
};
