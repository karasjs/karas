let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs><filter id="karas-defs-0-0" x="-0.019444444444444445" y="-0.12727272727272726" width="1.038888888888889" height="1.2545454545454544"><feGaussianBlur stdDeviation="2"></feGaussianBlur></filter></defs><g></g><g><g visibility="visible" filter="url(#karas-defs-0-0)"><g><path d="M0,0L360,0L360,50L0,50L0,0" fill="rgba(255,0,0,1)"></path></g><g></g></g></g></svg>')
      .end();
  }
};
