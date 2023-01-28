let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(300)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom","cache":true,"transform":"matrix(1,0,0,1,100,0)","lv":2},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M120,170C120,142.38576250846032 142.38576250846032,120 170,120C197.61423749153968,120 220,142.38576250846032 220,170C220,197.61423749153968 197.61423749153968,220 170,220C142.38576250846032,220 120,197.61423749153968 120,170"],["fill","rgba(0,0,255,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom","cache":true,"transform":"matrix(1,0,0,1,0,100)","lv":4}],"visibility":"visible","type":"dom","lv":1}],"visibility":"visible","type":"dom","defs":[],"lv":1}')
      .end();
  }
};
