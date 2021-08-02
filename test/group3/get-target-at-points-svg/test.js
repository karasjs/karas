let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '[{"tagName":"span","path":[0,0],"zPath":[0,0]},{"tagName":"div","path":[0],"zPath":[0]}]')
      .end();
  }
};
