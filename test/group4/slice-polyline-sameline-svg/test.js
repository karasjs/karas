let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M38.080000000000005,72C45.92,76 54.08,76 61.919999999999995,72"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M82.27433653999788,130.03853931702915Q96.13716826999894,123.86283173000106 110,110L110,210L10,210L10,110L10,110Q28.068584134999487,128.0685841349995 46.13716826999897,133.07821896425676"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M90,220L110,220L110,320L10,320L10,220L10,220L50.000000000000036,220"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
