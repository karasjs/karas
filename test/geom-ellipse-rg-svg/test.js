let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,50C0,22.38576250846032 22.38576250846032,0 50,0C77.61423749153968,0 100,22.38576250846032 100,50C100,77.61423749153968 77.61423749153968,100 50,100C22.38576250846032,100 0,77.61423749153968 0,50"],["fill","url(#karas-defs-0-0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["transform","matrix(1,0,0,0.5,0,0)"]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25,100C25,86.19288125423017 36.19288125423016,75 50,75C63.80711874576984,75 75,86.19288125423017 75,100C75,113.80711874576983 63.80711874576984,125 50,125C36.19288125423016,125 25,113.80711874576983 25,100"],["fill","url(#karas-defs-0-1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["transform","matrix(1,0,0,0.5,0,25)"]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",50],["cy",50],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",50],["cy",100],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
