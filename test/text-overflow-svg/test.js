let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1…"}]}],"visibility":"visible","overflow":"url(#karas-defs-0-0)","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",32.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","overflow":"url(#karas-defs-0-1)","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"clipPath","props":[],"children":[{"tagName":"path","props":[["d","M0,0L30,0L30,18.3984375L0,18.3984375,L0,0"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"clipPath","props":[],"children":[{"tagName":"path","props":[["d","M0,18.3984375L30,18.3984375L30,36.796875L0,36.796875,L0,18.3984375"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}]}')
      .end();
  }
};
