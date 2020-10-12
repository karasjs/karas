let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M162,0C162,-9.941125496954283 170.05887450304573,-18 180,-18C189.94112549695427,-18 198,-9.941125496954283 198,0C198,9.941125496954283 189.94112549695427,18 180,18C170.05887450304573,18 162,9.941125496954283 162,0"],["fill","rgba(0,0,255,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"type":"geom"}],"type":"dom","cache":true}],"type":"dom","defs":[],"cache":true}')
      .end();
  }
};
