let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L26.7031,0L26.7031,18.3984375L0,18.3984375L0,0"],["fill","url(#karas-defs-0-0)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"456"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",13.35155],["y1",0],["x2",13.35155],["y2",18.3984375]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0}]}')
      .end();
  }
};
