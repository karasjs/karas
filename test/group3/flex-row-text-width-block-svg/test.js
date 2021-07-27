let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M40,0L360,0L360,20L40,20L40,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",34.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1234"},{"type":"item","tagName":"text","props":[["x",0],["y",52.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"56"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M40,20L360,20L360,40L40,40L40,20"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
