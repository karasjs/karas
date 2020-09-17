let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,50C0,22.38576250846032 22.38576250846032,0 50,0C77.61423749153968,0 100,22.38576250846032 100,50C100,77.61423749153968 77.61423749153968,100 50,100C22.38576250846032,100 0,77.61423749153968 0,50"],["fill","url(#karas-defs-0-0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",0]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",50],["cy",50],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(0,255,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,0,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
