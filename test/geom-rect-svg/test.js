var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",2],["y",2],["width",100],["height",50],["fill","transparent"],["stroke","#F00"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",2],["y",56],["width",100],["height",50],["fill","transparent"],["stroke","#000"],["stroke-width",1],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[]}')
      .end();
  }
};
