let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '[{"0":"svg","1":0,"3":0,"4":3,"5":8},{"0":"span","1":1,"2":0,"3":1,"4":1,"5":1},{"0":"text","1":2,"2":0,"3":2},{"0":"div","1":3,"2":1,"3":1,"4":2,"5":3},{"0":"text","1":4,"2":0,"3":2},{"0":"span","1":5,"2":1,"3":2,"4":1,"5":1},{"0":"text","1":6,"2":0,"3":3},{"0":"span","1":7,"2":2,"3":1,"4":1,"5":1},{"0":"text","1":8,"2":0,"3":2}]')
      .end();
  }
};
