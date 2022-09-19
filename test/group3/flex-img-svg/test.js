let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"222222222222222222222222222222222"},{"type":"item","tagName":"text","props":[["x",0],["y",32.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"22222"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",310],["y",0],["width",100],["height",100],["transform","matrix(0.5,0,0,0.5,155,0)"]]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",64.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"222222222222222222222222222222222222"},{"type":"item","tagName":"text","props":[["x",0],["y",82.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"22"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0},{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",335],["y",50],["width",100],["height",100],["transform","matrix(0.25,0,0,0.5,251.25,25)"]]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","lv":1}],"visibility":"visible","type":"dom","defs":[],"lv":1}')
      .end();
  }
};
