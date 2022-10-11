let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M50,50L150,50L150,150L50,150L50,50"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M50,50L76.7031,50L76.7031,68.3984375L50,68.3984375L50,50"],["fill","rgba(0,255,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",50],["y",64.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","mixBlendMode":"lighten","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
