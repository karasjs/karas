let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><filter id="karas-defs-0-1" x="-0.03611111111111111" y="-0.23636363636363636" width="1.0722222222222222" height="1.4727272727272727"><feGaussianBlur stdDeviation="2"></feGaussianBlur></filter></defs><g></g><g><g visibility="visible" filter="url(#karas-defs-0-1)"><g><path d="M0,0L360,0L360,50L0,50L0,0" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
