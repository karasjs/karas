var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0C100,0 100,0 100,0L100,100C100,100 100,100 100,100L0,100C0,100 0,100 0,100L0,0C0,0 0,0 0,0"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"transform":"matrix(1,0,0,1,100,0)","type":"geom"}],"opacity":1,"type":"dom","defs":[],"cache":true}')
      .end();
  }
};
