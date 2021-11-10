let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '0.7071067811865476,0.7071067811865475,0,0,-0.7071067811865475,0.7071067811865476,0,0,0,0,1,0,150,-20.710678118654755,0,1')
      .end();
  }
};
