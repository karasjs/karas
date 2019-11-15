var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",26.71875],["height",18.3984375],["fill","url(#karas-defs-0-0)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"456"}]}],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",13.359375],["y1",-1.7763568394002505e-15],["x2",13.359375],["y2",18.3984375]],"children":[{"tagName":"stop","props":[["stop-color","#F00"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","#00F"],["offset","100%"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
