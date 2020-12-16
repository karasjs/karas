let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,38.3984375L0,38.3984375L0,0"],["fill","rgba(0,0,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"456"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",52.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
