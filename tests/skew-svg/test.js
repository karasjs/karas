var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","#F00"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"1"}]}],"transform":[["matrix","1,0,0.9999999999999999,1,-50,0"]],"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",100],["width",100],["height",100],["fill","#00F"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",114.484375],["fill","#000"],["font-size","16px"]],"content":"2"}]}],"transform":[["matrix","1,0.9999999999999999,0,1,0,-50"]],"type":"dom"}],"transform":[],"type":"dom","defs":[]}')
      .end();
  }
};
