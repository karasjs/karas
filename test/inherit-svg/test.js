var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",326.625],["y",27.158203125],["fill","#F00"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","30px"]],"content":"a"}]},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",343.3125],["y",27.158203125],["fill","#F00"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","30px"]],"content":"b"}]}],"transform":[],"opacity":1,"type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",345],["y",61.6552734375],["fill","#F00"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","30px"]],"content":"c"}]}],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom"}],"transform":[],"opacity":1,"type":"dom","defs":[]}')
      .end();
  }
};
