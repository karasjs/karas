let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,25C0,-2.6142374915396793 22.38576250846032,-25 50,-25C77.61423749153968,-25 100,-2.6142374915396793 100,25C100,52.61423749153968 77.61423749153968,75 50,75C22.38576250846032,75 0,52.61423749153968 0,25"],["fill","url(#karas-defs-0-0)"],["strokeWidth",0],["transform","matrix(1,0,0,0.5,0,12.5)"]]},{"type":"item","tagName":"path","props":[["d","M0,25C0,11.19288125423016 22.38576250846032,0 50,0C77.61423749153968,0 100,11.19288125423016 100,25C100,38.80711874576984 77.61423749153968,50 50,50C22.38576250846032,50 0,38.80711874576984 0,25"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,75C0,47.38576250846032 22.38576250846032,25 50,25C77.61423749153968,25 100,47.38576250846032 100,75C100,102.61423749153968 77.61423749153968,125 50,125C22.38576250846032,125 0,102.61423749153968 0,75"],["fill","url(#karas-defs-0-1)"],["strokeWidth",0],["transform","matrix(1,0,0,0.5,0,37.5)"]]},{"type":"item","tagName":"path","props":[["d","M0,75C0,61.19288125423016 22.38576250846032,50 50,50C77.61423749153968,50 100,61.19288125423016 100,75C100,88.80711874576984 77.61423749153968,100 50,100C22.38576250846032,100 0,88.80711874576984 0,75"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",50],["cy",25],["r",50]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"radialGradient","props":[["cx",50],["cy",75],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}]}')
      .end();
  }
};
