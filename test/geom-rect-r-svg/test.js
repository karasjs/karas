let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M27,2L27,2C40.80711874576984,2 52,13.19288125423016 52,27L52,27C52,40.80711874576984 40.80711874576984,52 27,52L27,52C13.19288125423016,52 2,40.80711874576984 2,27L2,27C2,13.19288125423016 13.19288125423016,2 27,2"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M7,54L47,54C49.76142374915397,54 52,60.7157287525381 52,69L52,89C52,97.2842712474619 49.76142374915397,104 47,104L7,104C4.238576250846032,104 2,97.2842712474619 2,89L2,69C2,60.7157287525381 4.238576250846032,54 7,54"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
