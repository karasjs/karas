let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,229.98046875L0,229.98046875L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L210,0L210,229.98046875L0,229.98046875L0,0"],["fill","rgba(0,255,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",36.2109375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"AAAAAAA"},{"type":"item","tagName":"text","props":[["x",0],["y",82.20703125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"AAAAAAA"},{"type":"item","tagName":"text","props":[["x",0],["y",128.203125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"AAAAAAA"},{"type":"item","tagName":"text","props":[["x",0],["y",174.19921875],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"AAAAAAA"},{"type":"item","tagName":"text","props":[["x",0],["y",220.1953125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"A"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",244.46484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"B"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
