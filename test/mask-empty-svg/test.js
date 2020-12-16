let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"looooooooooooooong"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M5,10L105,10L105,110L5,110L5,10"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",5],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","type":"dom","mask":"url(#karas-defs-0-0)"}],"visibility":"visible","type":"dom","defs":[{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"path","props":[["d",""],["fill","rgba(238,238,238,1)"],["stroke-width",0],["transform","matrix(1,0,0,1,0,0)"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
