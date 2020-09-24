let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><clipPath id="karas-defs-0-0"><rect x="0" y="0" width="360" height="120" fill="#FFF"></rect></clipPath><clipPath id="karas-defs-0-1"><rect x="0" y="120" width="360" height="50" fill="#FFF"></rect></clipPath><clipPath id="karas-defs-0-2"><rect x="0" y="170" width="50" height="120" fill="#FFF"></rect></clipPath></defs><g></g><g><g><g clip-path="url(#karas-defs-0-0)"><rect x="0" y="0" width="360" height="120" fill="rgba(0,0,0,1)"></rect><image xlink:href="../image.png" x="0" y="0" width="100" height="100" transform="matrix(3.6,0,0,3.6,0,0)"></image></g><g></g></g><g><g clip-path="url(#karas-defs-0-1)"><rect x="0" y="120" width="360" height="50" fill="rgba(0,255,0,1)"></rect><image xlink:href="../image.png" x="0" y="120" width="100" height="100" transform="matrix(3.6,0,0,3.6,0,-312)"></image></g><g></g></g><g><g clip-path="url(#karas-defs-0-2)"><rect x="0" y="170" width="50" height="120" fill="rgba(0,0,255,1)"></rect><image xlink:href="../image.png" x="0" y="170" width="100" height="100" transform="matrix(1.2,0,0,1.2,0,-34)"></image></g><g></g></g></g></svg>')
      .end();
  }
};
