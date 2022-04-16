let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M1.046875,0L36.796875,0L36.796875,88.9844L1.046875,88.9844L1.046875,0"],["fill","rgba(0,255,255,1)"]]},{"type":"item","tagName":"path","props":[["d","M37.84375,0L73.59375,0L73.59375,35.5938L37.84375,35.5938L37.84375,0"],["fill","rgba(0,255,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",19.13125],["y",0],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","32px"],["writing-mode","vertical-lr"]],"content":"aaaaa"},{"type":"item","tagName":"text","props":[["x",55.928125],["y",0],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","32px"],["writing-mode","vertical-lr"]],"content":"aa"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
