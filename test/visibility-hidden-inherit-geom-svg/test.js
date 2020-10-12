let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[]},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,18.3984375L360,18.3984375"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"hidden","type":"geom"}],"visibility":"hidden","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}hidden')
      .end();
  }
};
