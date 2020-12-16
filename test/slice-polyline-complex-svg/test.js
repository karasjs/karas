let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M207.24161660864087,30.341003417969006C219.16325557458347,30.341003417969006 227.12899017334001,30.341003417969006 227.12899017334001,30.341003417969006C235.452995300293,30.341003417969006 242.200996398926,37.0885009765625 242.200996398926,45.412498474120994C242.200996398926,45.412498474120994 242.200996398926,94.69733704736444 242.200996398926,138.81140011781235"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
