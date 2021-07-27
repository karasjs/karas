let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,50C0,22.38576250846032 22.38576250846032,0 50,0C77.61423749153968,0 100,22.38576250846032 100,50C100,77.61423749153968 77.61423749153968,100 50,100C22.38576250846032,100 0,77.61423749153968 0,50"],["fill","rgba(0,0,255,1)"],["stroke-width",0]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
