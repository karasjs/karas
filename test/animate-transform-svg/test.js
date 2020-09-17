let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '1,0,0,1,0,0/0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,70.71067811865476,70.71067811865474')
      .end();
  }
};
