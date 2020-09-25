let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><clipPath id="karas-defs-0-0"><rect x="180" y="0" width="50" height="50" fill="#FFF"></rect></clipPath></defs><g></g><g><g transform="matrix(1,0,0,1,-25,0)"><g clip-path="url(#karas-defs-0-0)"><image xlink:href="../image.png" x="155" y="0" width="100" height="100" transform="matrix(0.5,0,0,0.5,77.5,0)"></image></g><g></g></g></g></svg>')
      .end();
  }
};
