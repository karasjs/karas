let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","filter":"url(#karas-defs-0-0)","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"filter","props":[["x",-0.07],["y",-0.07],["width",1.1400000000000001],["height",1.1400000000000001]],"children":[{"tagName":"feGaussianBlur","props":[["stdDeviation",1]]}],"id":0,"uuid":"karas-defs-0-0","index":0}]}')
      .end();
  }
};
