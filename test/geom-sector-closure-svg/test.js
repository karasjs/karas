var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,27L27,2A25,25 0 1 1 3.5076844803522924,18.44949641685828 z"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M27,2A25,25 0 1 1 3.5076844803522924,18.44949641685828"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,81L27,56A25,25 0 1 1 3.5076844803522924,72.44949641685828 z"],["fill","rgba(255,0,0,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,110A25,25 0 1 1 3.5076844803522924,126.44949641685828z"],["fill","rgba(255,0,0,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,164A25,25 0 1 1 3.5076844803522924,180.44949641685827z"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M27,164A25,25 0 1 1 3.5076844803522924,180.44949641685827"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,243L27,218A25,25 0 0 1 52,243 z"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M27,218A25,25 0 0 1 52,243"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
