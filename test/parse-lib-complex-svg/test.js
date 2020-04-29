var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,255,1)"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","16px"]],"content":"123"}]}],"opacity":1,"type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",26.71875],["y",14.484375],["fill","rgba(255,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","italic"],["font-size","16px"]],"content":"456"}]}],"opacity":1,"type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",53.4375],["y",14.484375],["fill","rgba(0,0,255,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"opacity":1,"type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",80.15625],["y",14.484375],["fill","rgba(0,255,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"456"}]}],"opacity":1,"type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",106.875],["y",14.484375],["fill","rgba(0,255,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
