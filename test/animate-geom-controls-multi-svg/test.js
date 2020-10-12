let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0C10,10 90,10 100,0Q90,50 100,100L0,0M100,100Q90,90 0,100L0,0L100,100"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"type":"geom"}],"type":"dom","defs":[],"cache":true}{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0C20,20 80,20 100,0C10,50 80,50 100,100Q55.00000000000001,45 0,0M100,100L0,100L0,0Q10,10 100,100"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"type":"geom"}],"type":"dom","defs":[],"cache":true}')
      .end();
  }
};
