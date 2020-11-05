let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '[{"node":"svg","index":0,"lv":0,"num":3,"total":8},{"node":"span","index":1,"childIndex":0,"lv":1,"num":1,"total":1},{"node":"text","index":2,"childIndex":0,"lv":2},{"node":"div","index":3,"childIndex":1,"lv":1,"num":2,"total":3},{"node":"text","index":4,"childIndex":0,"lv":2},{"node":"span","index":5,"childIndex":1,"lv":2,"num":1,"total":1},{"node":"text","index":6,"childIndex":0,"lv":3},{"node":"span","index":7,"childIndex":2,"lv":1,"num":1,"total":1},{"node":"text","index":8,"childIndex":0,"lv":2}]')
      .end();
  }
};
