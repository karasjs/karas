let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,27L39.5,5.349364905389031A25,25 0 0 1 51.6201938253052,31.34120444167326z"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]},{"type":"item","tagName":"path","props":[["d","M27,27L48.65063509461097,39.5A25,25 0 0 1 3.5076844803522924,18.44949641685828z"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"type":"geom"}],"type":"dom","defs":[]}')
      .end();
  }
};
