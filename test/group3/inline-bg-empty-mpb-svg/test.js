let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(50)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M30,30L80,30L80,128.3984375L30,128.3984375L30,30"],["fill","rgba(204,204,204,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M40,20L140,20L140,138.3984375L40,138.3984375L40,20"],["fill","rgba(255,0,0,1)"]]},{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",40],["y",29.19921875],["width",100],["height",100]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","lv":1}],"visibility":"visible","type":"dom","defs":[],"lv":1}')
      .end();
  }
};
