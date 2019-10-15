var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M 0 0L 100 0 L 50 50 L 50 50 "],["fill","#000"]]},{"type":"item","tagName":"path","props":[["d","M 50 50L 100 0 L 100 100 L 50 50 "],["fill","#F00"]]},{"type":"item","tagName":"path","props":[["d","M 0 100L 50 50 L 50 50 L 100 100 "],["fill","#999"]]},{"type":"item","tagName":"path","props":[["d","M 0 0L 50 50 L 50 50 L 0 100 "],["fill","#00F"]]}],"children":[],"transform":[],"type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M 0 100L 110 100 L 60 150 L 50 150 "],["fill","#000"]]},{"type":"item","tagName":"path","props":[["d","M 60 150L 110 100 L 110 210 L 60 160 "],["fill","#F00"]]},{"type":"item","tagName":"path","props":[["d","M 0 210L 50 160 L 60 160 L 110 210 "],["fill","#999"]]},{"type":"item","tagName":"path","props":[["d","M 0 100L 50 150 L 50 160 L 0 210 "],["fill","#00F"]]}],"children":[],"transform":[],"type":"dom"}],"transform":[],"type":"dom","defs":[]}')
      .end();
  }
};
