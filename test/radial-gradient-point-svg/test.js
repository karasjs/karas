let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",-150],["y",-874.4271909999158],["width",400],["height",1788.8543819998315],["fill","url(#karas-defs-0-0)"],["clip-path","url(#karas-defs-0-1)"],["transform","matrix(0.866740335327919,0.49875965265410793,-0.22305209755375377,0.38761806172683794,29.094798118086146,-15.22937018305123)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",110],["cy",64.72135954999578],["r",80.62257748298549]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"clipPath","children":[{"tagName":"rect","props":[["x",50],["y",20],["width",100],["height",200],["fill","#FFF"],["transform","matrix(0.866740335327919,-1.1152604877687686,0.498759652654108,1.9380903086341892,-17.62183969452863,61.96417349908468)"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
