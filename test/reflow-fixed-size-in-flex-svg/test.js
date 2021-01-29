let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(100)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,160L0,160L0,0"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L243.765625,10L243.765625,150L10,150L10,10"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M20,20L140,20L140,140L20,140L20,20"],["fill","rgba(153,153,153,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M30,30L116.71875,30L116.71875,108.3984375L30,108.3984375L30,30"],["fill","rgba(0,255,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",60],["y",74.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","lv":0},{"bb":[{"type":"item","tagName":"path","props":[["d","M243.765625,10L350,10L350,150L243.765625,150L243.765625,10"],["fill","rgba(153,153,153,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",243.765625],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"in"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0}],"visibility":"visible","type":"dom","lv":0},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",174.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"next"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
