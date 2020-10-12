let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../image.png"],["x",0],["y",0],["width",100],["height",100]]}],"transform":"matrix(1,0,0,1,100,100)","type":"dom"}],"type":"dom","defs":[]}')
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
