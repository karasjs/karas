let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L60,10L60,74.39453125L10,74.39453125L10,10"],["fill","rgba(204,204,204,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L27.7969,10L27.7969,27.875L10,27.875L10,10"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M10,50.125L42.25,50.125L42.25,68L10,68L10,50.125"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"22"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,28.3984375L42.25,28.3984375L42.25,73.0859375L10,73.0859375L10,28.3984375"],["fill","rgba(0,0,255,0.3)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",20],["y",64.609375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","40px"]],"content":"3"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
