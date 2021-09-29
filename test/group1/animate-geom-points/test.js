let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:04:20.9831877Z ✔ Testing if value of element <input> equals '0,0,1,0,1,1/0.5,0,1,0,1,0.5' (20ms)'0,0,1,0,1,1/0.5,0,1,0,1,0.5' (20ms)'0,0,1,0,1,1/0.5,0,1,0,1,0.5' (20ms)'0,0,1,0,1,1/0.5,0,1,0,1,0.5' (20ms)')
      .end();
  }
};
