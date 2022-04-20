let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(50)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L250,0L250,138.3984375L0,138.3984375L0,0"],["fill","rgba(204,204,204,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L118.90625,10L118.90625,128.13671875L10,128.13671875L10,10"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"use","props":[["xlink:href","#karas-defs-0-0"],["x",10],["y",10],["clip-path","url(#karas-defs-0-1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",60],["y",74.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","lv":0}],"visibility":"visible","type":"dom","defs":[{"tagName":"symbol","props":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",4.453125],["y",9.19921875],["width",100],["height",100]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"clipPath","props":[],"children":[{"tagName":"path","props":[["d","M0,0L108.90625,0L108.90625,118.3984375L0,118.3984375,L0,0"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}],"lv":0}')
      .end();
  }
};
