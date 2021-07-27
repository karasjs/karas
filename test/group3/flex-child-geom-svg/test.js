let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,10C0,4.477152501692064 4.477152501692064,0 10,0C15.522847498307936,0 20,4.477152501692064 20,10C20,15.522847498307936 15.522847498307936,20 10,20C4.477152501692064,20 0,15.522847498307936 0,10"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",20],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
