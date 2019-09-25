var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",18.3984375],["fill","#0F0"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"#00F"}]}]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",18.3984375],["width",360],["height",18.3984375],["fill","#0F0"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",32.8828125],["fill","#000"],["font-size","16px"]],"content":"#F00"}]}]}]}')
      .moveToElement('canvas', 1, 1)
      .pause(100)
      .mouseButtonClick()
      .pause(100)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",18.3984375],["fill","#00F"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"#00F"}]}]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",18.3984375],["width",360],["height",18.3984375],["fill","#00F"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",32.8828125],["fill","#000"],["font-size","16px"]],"content":"#F00"}]}]}]}')
      .moveToElement('canvas', 1, 21)
      .pause(100)
      .mouseButtonClick()
      .pause(100)
      .assert.value('input', '{"bb":[],"type":"dom","children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",18.3984375],["fill","#F00"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"#00F"}]}]},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",18.3984375],["width",360],["height",18.3984375],["fill","#F00"]]}],"type":"dom","children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",32.8828125],["fill","#000"],["font-size","16px"]],"content":"#F00"}]}]}]}')
      .end();
  }
};
