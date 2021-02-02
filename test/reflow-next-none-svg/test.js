let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,78.3984375L0,78.3984375L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",30],["y",44.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[],"visibility":"visible","type":"dom","cache":true,"lv":0},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,78.3984375L360,78.3984375L360,116.796875L0,116.796875L0,78.3984375"],["fill","rgba(0,255,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",102.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
