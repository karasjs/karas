let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><g visibility="visible"><g></g><g><g transform="matrix(1,0,0,0.9,0,4.949999999999999)" visibility="visible"><g></g><g><path d="M25,27L28.75,27C28.75,29.071067811865476 27.071067811865476,30.75 25,30.75C22.928932188134524,30.75 21.25,29.071067811865476 21.25,27C21.25,24.928932188134528 22.928932188134524,23.25 25,23.25L25,27" fill="rgba(16,142,233,1)" stroke-width="0"></path></g></g></g></g></g></g></g>')
      .end();
  }
};
