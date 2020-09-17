let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,2L27,2C40.80711874576984,2 52,13.19288125423016 52,27L52,27C52,40.80711874576984 40.80711874576984,52 27,52L27,52C13.19288125423016,52 2,40.80711874576984 2,27L2,27C2,13.19288125423016 13.19288125423016,2 27,2"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M7,56L47,56C49.76142374915397,56 52,62.7157287525381 52,71L52,91C52,99.2842712474619 49.76142374915397,106 47,106L7,106C4.238576250846032,106 2,99.2842712474619 2,91L2,71C2,62.7157287525381 4.238576250846032,56 7,56"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
