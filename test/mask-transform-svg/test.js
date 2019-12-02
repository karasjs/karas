var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",360],["fill","#F00"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"transform":[],"opacity":1,"type":"dom","mask":"url(#karas-defs-0-0)"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"polygon","props":[["points","100,50 150,100 100,100 "],["fill","#fff"],["stroke","#000"],["stroke-width",0]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
