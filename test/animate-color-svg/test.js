var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgb(0,0,255)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"transform":[],"type":"dom"}],"transform":[],"type":"dom","defs":[]}')
      .end();
  }
};
