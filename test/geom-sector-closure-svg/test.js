var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27 27 L27 2 A25 25 0 1 1 3.5076844803522924 18.44949641685828 z"],["fill","#F00"]]},{"type":"item","tagName":"path","props":[["d","M27 2 A25 25 0 1 1 3.5076844803522924 18.44949641685828"],["fill","transparent"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27 81 L27 56 A25 25 0 1 1 3.5076844803522924 72.44949641685828 z"],["fill","#F00"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27 110 A25 25 0 1 1 3.5076844803522924 126.44949641685828 z"],["fill","#F00"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27 164 A25 25 0 1 1 3.5076844803522924 180.44949641685827 z"],["fill","#F00"]]},{"type":"item","tagName":"path","props":[["d","M27 164 A25 25 0 1 1 3.5076844803522924 180.44949641685827"],["fill","transparent"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27 243 L27 218 A25 25 0 0 1 52 243 z"],["fill","#F00"]]},{"type":"item","tagName":"path","props":[["d","M27 218 A25 25 0 0 1 52 243"],["fill","transparent"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"opacity":1,"type":"geom"}],"transform":[],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
