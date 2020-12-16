let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,50C0,22.38576250846032 22.38576250846032,0 50,0C77.61423749153968,0 100,22.38576250846032 100,50C100,77.61423749153968 77.61423749153968,100 50,100C22.38576250846032,100 0,77.61423749153968 0,50"],["fill","url(#karas-defs-0-0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["transform","matrix(1,0,0,0.5,0,0)"]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,100C0,72.38576250846032 22.38576250846032,50 50,50C77.61423749153968,50 100,72.38576250846032 100,100C100,127.61423749153968 77.61423749153968,150 50,150C22.38576250846032,150 0,127.61423749153968 0,100"],["fill","url(#karas-defs-0-1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1],["transform","matrix(1,0,0,0.5,0,25)"]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",50],["cy",50],["r",50]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"radialGradient","props":[["cx",50],["cy",100],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
