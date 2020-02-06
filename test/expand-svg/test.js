var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","#F00"]]}],"children":[],"opacity":1,"transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,150,-20.710678118654755)","type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",100],["width",100],["height",100],["fill","#F00"]]}],"children":[],"opacity":1,"transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,170.71067811865476,29.289321881345245)","type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
