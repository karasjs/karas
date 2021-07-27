let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,158.3984375L0,158.3984375L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L130,10L130,130L10,130L10,10"],["fill","rgba(0,255,0,0.6)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M20,20L120,20L120,98.3984375L20,98.3984375L20,20"],["fill","rgba(0,0,255,0.3)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",50],["y",64.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",20],["y",112.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next0"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","lv":0},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",144.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next1"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0}],"visibility":"visible","type":"dom","lv":0},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",172.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next2"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
