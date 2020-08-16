var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"cache":true,"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"transform":"matrix(1,0,0,1,100,0)","type":"geom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
