let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",100],["y",100],["width",90],["height",80],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",100],["y",114.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"filter":"url(#karas-defs-0-0)","type":"dom"}],"type":"dom","defs":[{"tagName":"filter","props":[["x",-0.3],["y",-0.3375],["width",1.6],["height",1.675]],"children":[{"tagName":"feGaussianBlur","props":[["stdDeviation",5]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
