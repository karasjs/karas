let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0Q50,0 100,30C100,50 80,90 50,100M60,60L200,130L150,110.00000000000001"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
