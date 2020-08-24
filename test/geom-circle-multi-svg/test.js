var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M45,50C45,47.23857625084603,47.23857625084603,45,50,45C52.76142374915397,45,55,47.23857625084603,55,50C55,52.76142374915397,52.76142374915397,55,50,55C47.23857625084603,55,45,52.76142374915397,45,50M25,50C25,36.19288125423016,36.19288125423016,25,50,25C63.80711874576984,25,75,36.19288125423016,75,50C75,63.80711874576984,63.80711874576984,75,50,75C36.19288125423016,75,25,63.80711874576984,25,50"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
