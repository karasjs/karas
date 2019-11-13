var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",32],["height",32],["stroke","#CCC"],["stroke-width",0.64],["fill","transparent"]]},{"type":"item","tagName":"circle","props":[["cx",22.4],["cy",9.6],["r",3.2],["fill","#DDD"]]},{"type":"item","tagName":"polygon","props":[["points","4.8,22.4 9.6,12.8 16,19.2 19.2,16 28.8,25.6 4.8,25.6 "],["fill","#DDD"]]}],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
