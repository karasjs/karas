var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","#F00"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","#000"],["font-size","16px"]],"content":"1"}]}],"transform":[["matrix","0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,50,-20.710678118654755"]],"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",40],["width",20],["height",20],["fill","#0FF"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",54.484375],["fill","#000"],["font-size","16px"]],"content":"2"}]}],"transform":[],"type":"dom"}],"transform":[],"type":"dom","defs":[]}')
      .moveToElement('svg', 50, 1)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 10, 10)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 50, 1)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
