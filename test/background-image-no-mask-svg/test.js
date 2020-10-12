let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",100],["y",100],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",0],["y",100],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",200],["y",100],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",100],["y",0],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",100],["y",200],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",0],["y",0],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",200],["y",0],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",0],["y",200],["width",100],["height",100]]},{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",200],["y",200],["width",100],["height",100]]}],"children":[],"type":"dom"}],"type":"dom","defs":[],"cache":true}')
      .end();
  }
};
