let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible" transform="matrix(0.5,0,0,0.5,17.5,17.5)"><g><path d="M10,10L60,10L60,60L10,60L10,10" fill="rgba(255,0,0,1)"></path></g><g></g></g><g transform="matrix(0.5,0,0,0.5,17.5,47.5)" visibility="visible"><g><path d="M10,70L60,70L60,120L10,120L10,70" fill="rgba(255,0,0,1)"></path></g><g></g></g><g visibility="visible" transform="matrix(0.5,0,0,0.5,27.5,87.5)"><g><path d="M10,130L60,130L60,180L10,180L10,130" fill="rgba(255,0,0,1)"></path></g><g></g></g><g transform="matrix(6.123233995736766e-17,1,-1,6.123233995736766e-17,260,190)" visibility="visible"><g><path d="M10,190L60,190L60,240L10,240L10,190" fill="rgba(255,0,0,1)"></path></g><g></g></g><g transform="matrix(3.061616997868383e-17,0.5,-0.5,3.061616997868383e-17,182.5,267.5)" visibility="visible"><g><path d="M10,250L60,250L60,300L10,300L10,250" fill="rgba(255,0,0,1)"></path></g><g></g></g></g>')
      .end();
  }
};
