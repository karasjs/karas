let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",324.9844],["y",27.158203125],["fill","rgba(255,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","30px"]],"content":"a"}]},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",341.6719],["y",27.158203125],["fill","rgba(255,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","30px"]],"content":"b"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",343.3125],["y",61.6552734375],["fill","rgba(255,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","italic"],["font-size","30px"]],"content":"c"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
