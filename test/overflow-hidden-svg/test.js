let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"客官你超越了全国15%的人！"}]}],"visibility":"visible","overflow":"url(#karas-defs-0-0)","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M80,80L130,80L130,130L80,130L80,80"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","overflow":"url(#karas-defs-0-1)","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"clipPath","props":[],"children":[{"tagName":"path","props":[["d","M10,10L350,10L350,28.3984375L10,28.3984375,L10,10"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"clipPath","props":[],"children":[{"tagName":"path","props":[["d","M0,0L100,0L100,100L0,100,L0,0"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}]}')
      .end();
  }
};
