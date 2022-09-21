let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L200,0L200,200L0,200L0,0"],["fill","rgba(0,0,0,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",180],["y",0],["width",100],["height",100],["clip-path","url(#karas-defs-0-0)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M0,0L200,0L200,200L0,200L0,0"],["fill","#FFF"]]}],"id":0,"uuid":"karas-defs-0-0","index":0}],"lv":1}')
      .end();
  }
};
