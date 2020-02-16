var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",2],["y",2],["width",50],["height",50],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["rx",25],["ry",25]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",2],["y",56],["width",50],["height",50],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["rx",5],["ry",15]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
