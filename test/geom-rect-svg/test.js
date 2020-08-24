var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M2,2L102,2C102,2,102,2,102,2L102,52C102,52,102,52,102,52L2,52C2,52,2,52,2,52L2,2C2,2,2,2,2,2"],["fill","rgba(0,0,0,0)"],["stroke","rgba(255,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M2,56L102,56C102,56,102,56,102,56L102,106C102,106,102,106,102,106L2,106C2,106,2,106,2,106L2,56C2,56,2,56,2,56"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
