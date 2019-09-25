var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"1"}]}]},{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",175.19531],["y",32.8828125],["fill","#000"],["font-size","16px"]],"content":"1"}]}]},{"bb":[],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",350.39062],["y",51.28125],["fill","#000"],["font-size","16px"]],"content":"1"}]}]}]}')
      .end();
  }
};
