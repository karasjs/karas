var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",0],["y",0],["width",0],["height",0]]}],"opacity":1,"transform":"matrix(1,0,0,1,100,100)","type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .moveToElement('svg', 101, 101)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 1, 1)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 101, 101)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
