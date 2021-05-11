let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L300,0L300,18.3984375L0,18.3984375L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"a"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,28.3984375L158,28.3984375L158,176.3984375L10,176.3984375L10,28.3984375"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../logo.png"],["x",20],["y",38.3984375],["width",128],["height",128]]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,186.3984375L300,186.3984375L300,204.796875L0,204.796875L0,186.3984375"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",200.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"a"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,214.796875L80,214.796875L80,284.796875L10,284.796875L10,214.796875"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M20,224.796875L70,224.796875L70,274.796875L20,274.796875L20,224.796875"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
