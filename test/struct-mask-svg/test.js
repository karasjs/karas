let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '[{"node":"svg","index":0,"lv":0,"num":2,"total":3},{"node":"div","index":1,"childIndex":0,"lv":1,"hasMask":1,"num":1,"total":1},{"node":"text","index":2,"childIndex":0,"lv":2},{"node":"$circle","index":3,"childIndex":1,"lv":1}]')
      .end();
  }
};
