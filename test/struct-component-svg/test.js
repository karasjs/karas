let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '[{"0":"svg","1":0,"3":0,"4":1,"5":5},{"0":"div","1":1,"2":0,"3":1,"4":2,"5":4},{"0":"span","1":2,"2":0,"3":2,"4":1,"5":1},{"0":"text","1":3,"2":0,"3":3},{"0":"p","1":4,"2":1,"3":2,"4":1,"5":1},{"0":"text","1":5,"2":0,"3":3}]')
      .end();
  }
};
