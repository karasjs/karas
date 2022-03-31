let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M20,20L21,20L21,21L20,20M21,20L121,20L121,21L21,21M121,20L122,20L122,20L121,21"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M122,20L122,20L122,21L121,21M121,21L122,21L122,121L121,121M121,121L122,121L122,122L122,122"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M20,122L21,121L21,122L20,122M21,121L121,121L121,122L21,122M121,121L122,122L122,122L121,122"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M20,20L20,20L21,21L20,21M20,21L21,21L21,121L20,121M20,121L21,121L20,122L20,122"],["fill","rgba(0,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",21],["y",35.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"visibility":"visible","filter":"drop-shadow(2px 2px 3px rgba(255,0,0,1))","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
