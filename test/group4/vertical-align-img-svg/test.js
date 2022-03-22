let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L200,0L200,304.92578125L0,304.92578125L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",128],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","100px"]],"content":"jj"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M44.4375,0L172.4375,0L172.4375,128L44.4375,128L44.4375,0"],["fill","rgba(0,0,255,1)"]]}],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../../logo.png"],["x",44.4375],["y",0],["width",128],["height",128]]}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",280.462890625],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","100px"]],"content":"y"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M50,152.462890625L178,152.462890625L178,280.462890625L50,280.462890625L50,152.462890625"],["fill","rgba(0,0,255,1)"]]}],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../../logo.png"],["x",50],["y",152.462890625],["width",128],["height",128]]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",319.41015625],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"a"}]},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",337.80859375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"b"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
