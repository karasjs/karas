let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '9T06:03:11.2136608Z ✔ Testing if value of element <input> equals '/a0,0,0,1cancel0cancel1cancel2' (39ms)'/a0,0,0,1cancel0cancel1cancel2' (39ms)'/a0,0,0,1cancel0cancel1cancel2' (39ms)'/a0,0,0,1cancel0cancel1cancel2' (39ms)')
      .end();
  }
};
