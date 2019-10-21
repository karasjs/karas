var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"circle","props":[["cx",50],["cy",50],["r",50],["fill","#00F"],["stroke","#000"],["stroke-width",0],["stroke-dasharray",[]]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[]}')
      .end();
  }
};
