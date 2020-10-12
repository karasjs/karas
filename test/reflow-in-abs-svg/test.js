let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next"}],"cache":true}],"type":"dom","cache":true},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",106.71875],["height",98.3984375],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",30],["y",30],["width",46.71875],["height",38.3984375],["fill","rgba(0,255,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",40],["y",54.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"type":"dom"}],"type":"dom"}],"type":"dom","defs":[],"cache":true}')
      .end();
  }
};
