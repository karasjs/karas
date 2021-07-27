let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M45,25C45,23.619288125423015 47.23857625084603,22.5 50,22.5C52.76142374915397,22.5 55,23.619288125423015 55,25C55,26.380711874576985 52.76142374915397,27.5 50,27.5C47.23857625084603,27.5 45,26.380711874576985 45,25M25,25C25,18.09644062711508 36.19288125423016,12.5 50,12.5C63.80711874576984,12.5 75,18.09644062711508 75,25C75,31.90355937288492 63.80711874576984,37.5 50,37.5C36.19288125423016,37.5 25,31.90355937288492 25,25"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
