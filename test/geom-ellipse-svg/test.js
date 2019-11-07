var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"ellipse","props":[["cx",50],["cy",25],["rx",50],["ry",25],["fill","transparent"],["stroke","#000"],["stroke-width",1]]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"ellipse","props":[["cx",50],["cy",75],["rx",25],["ry",12.5],["fill","transparent"],["stroke","#000"],["stroke-width",1]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[]}')
      .end();
  }
};
