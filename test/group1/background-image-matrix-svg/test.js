let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs><clipPath id="karas-defs-0-0"><path d="M205,0L305,0L305,100L205,100L205,0" fill="#FFF"></path></clipPath></defs><g></g><g><g transform="matrix(1,0,0,1,-25,0)" visibility="visible"><g><image xlink:href="../../image.png" x="155" y="0" width="100" height="100" transform="matrix(0.5,0,0,0.5,77.5,0)" clip-path="url(#karas-defs-0-0)"></image></g><g></g></g></g>')
      .end();
  }
};
