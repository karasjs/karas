let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L125.65625,10L125.65625,110L10,110L10,10"],["fill","rgba(0,255,255,1)"]]}],"children":[{"bb":[],"children":[],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",28.3984375],["y",60],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","32px"],["writing-mode","vertical-lr"]],"content":"a"}]},{"bb":[],"children":[],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",86.2265625],["y",60],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","32px"],["writing-mode","vertical-lr"]],"content":"a"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,120L65.1953125,120L65.1953125,155.60935L10,155.60935L10,120"],["fill","rgba(0,255,255,1)"]]}],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",37.59765625],["y",120],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","48px"],["writing-mode","vertical-lr"]],"content":"a"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",27.02734375],["y",146.7031],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"],["writing-mode","vertical-lr"]],"content":"b"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
