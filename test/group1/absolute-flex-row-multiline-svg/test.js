let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L1,0L1,1L0,0M1,0L301,0L301,1L1,1M301,0L302,0L302,0L301,1"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M302,0L302,0L302,1L301,1M301,1L302,1L302,92.9921875L301,92.9921875M301,92.9921875L302,92.9921875L302,93.9921875L302,93.9921875"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,93.9921875L1,92.9921875L1,93.9921875L0,93.9921875M1,92.9921875L301,92.9921875L301,93.9921875L1,93.9921875M301,92.9921875L302,93.9921875L302,93.9921875L301,93.9921875"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L0,0L1,1L0,1M0,1L1,1L1,92.9921875L0,92.9921875M0,92.9921875L1,92.9921875L0,93.9921875L0,93.9921875"],["fill","rgba(0,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M1,1L301,1L301,92.9921875L1,92.9921875L1,1"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M1,1L201,1L201,46.99609375L1,46.99609375L1,1"],["fill","rgba(0,255,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",1],["y",37.2109375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"A"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M1,46.99609375L301,46.99609375L301,92.9921875L1,92.9921875L1,46.99609375"],["fill","rgba(0,0,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",1],["y",83.20703125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","40px"]],"content":"B"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
