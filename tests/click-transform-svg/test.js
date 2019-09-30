var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","#F00"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"1"}]}],"transform":[["matrix","1.7071067811865475,0.7071067811865475,0.7071067811865475,1.7071067811865475,0,0"]],"type":"dom"}],"transform":[],"type":"dom","defs":[]}')
      .moveToElement('canvas', 50, 50)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 1, 50)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 50, 1)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('canvas', 50, 50)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
