let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,120L0,120L0,0"],["fill","rgba(0,0,0,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",130],["y",10],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,120L360,120L360,240L0,240L0,120"],["fill","rgba(0,255,0,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",260],["y",125],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,240L360,240L360,360L0,360L0,240"],["fill","rgba(0,0,255,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",50],["y",260],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
