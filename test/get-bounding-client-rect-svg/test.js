let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"left":99.13499492031626,"top":-0.8650050796837405,"right":200.86500507968373,"bottom":100.86500507968374}')
      .end();
  }
};
