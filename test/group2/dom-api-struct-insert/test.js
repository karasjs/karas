let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '[{"node":"canvas","childIndex":0,"lv":0,"num":4,"total":8},{"node":"span","childIndex":0,"lv":1,"num":1,"total":1},{"node":"text","childIndex":0,"lv":2},{"node":"div","childIndex":1,"lv":1,"num":1,"total":1},{"node":"text","childIndex":0,"lv":2},{"node":"span","childIndex":2,"lv":1,"num":1,"total":1},{"node":"text","childIndex":0,"lv":2},{"node":"p","childIndex":3,"lv":1,"num":1,"total":1},{"node":"text","childIndex":0,"lv":2}]')
      .end();
  }
};
