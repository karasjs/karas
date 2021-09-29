let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:05.4889069Z ✔ Testing if value of element <input> equals '10/true/100' (18ms)'10/true/100' (18ms)'10/true/100' (18ms)'10/true/100' (18ms)')
      .end();
  }
};
