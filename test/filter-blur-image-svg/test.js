let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[],"visibility":"visible","filter":"blur(1px)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
