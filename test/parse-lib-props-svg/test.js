var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["points","0,0 100,0 0,100 0,0"]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["points","0,100 100,100 100,200 0,200 0,100"]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polyline","props":[["fill","rgba(0,0,0,0)"],["stroke","rgba(255,0,0,1)"],["stroke-width",1],["points","0,200 100,200 0,300 0,200"]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
