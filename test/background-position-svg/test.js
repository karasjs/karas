let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",360],["height",120],["fill","rgba(0,0,0,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",130],["y",10],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",120],["width",360],["height",120],["fill","rgba(0,255,0,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",260],["y",125],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",240],["width",360],["height",120],["fill","rgba(0,0,255,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",50],["y",260],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
