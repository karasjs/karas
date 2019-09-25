var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[],"type":"dom","children":[{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",145.037109375],["fill","#000"],["font-size","40px"]],"content":"hello"}]}]},{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",169.306640625],["fill","#000"],["font-size","16px"]],"content":"hello"}]}]}]},{"bb":[],"type":"dom","children":[{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",100],["y",36.2109375],["fill","#000"],["font-size","40px"]],"content":"world"}]}]},{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",100],["y",100.3125],["fill","#000"],["font-size","60px"]],"content":"wo"},{"type":"item","tagName":"text","props":[["x",100],["y",169.306640625],["fill","#000"],["font-size","60px"]],"content":"rld"}]}]}]}]}')
      .end();
  }
};
