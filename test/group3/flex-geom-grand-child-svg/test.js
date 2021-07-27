let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,50L0,50L0,0"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L195,10L195,40L10,40L10,10"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M20,20L30,20L30,30L20,30L20,20"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M195,10L350,10L350,40L195,40L195,10"],["fill","rgba(153,153,153,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",195],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"in"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
