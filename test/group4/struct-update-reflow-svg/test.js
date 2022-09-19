let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '[{"node":"svg","childIndex":0,"lv":0,"num":1,"total":5},{"node":"div","childIndex":0,"lv":1,"num":2,"total":4},{"node":"span","childIndex":0,"lv":2,"num":1,"total":1},{"node":"text","childIndex":0,"lv":3},{"node":"strong","childIndex":1,"lv":2,"num":1,"total":1},{"node":"text","childIndex":0,"lv":3}]')
      .end();
  }
};
