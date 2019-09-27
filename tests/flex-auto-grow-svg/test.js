var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[],"type":"dom","children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",180],["height",18.3984375],["fill","#F00"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"1"}]}]},{"bb":[{"type":"item","tagName":"rect","props":[["x",180],["y",0],["width",180],["height",18.3984375],["fill","#00F"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",180],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"2"}]}]}]}],"defs":[]}')
      .end();
  }
};
