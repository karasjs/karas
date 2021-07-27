let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2222222"}]},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",62.34375],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"33333"}]}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",106.875],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"444444"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
