let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",27.158203125],["fill","rgba(0,0,255,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","30px"]],"content":"123"}]}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
