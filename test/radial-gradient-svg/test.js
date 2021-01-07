let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L50,0L50,50L0,50L0,0"],["fill","url(#karas-defs-0-0)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,51L50,51L50,101L0,101L0,51"],["fill","url(#karas-defs-0-1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,92L50,92L50,158.66666666666666L0,158.66666666666666L0,92"],["fill","url(#karas-defs-0-2)"],["transform","matrix(1,0,0,0.75,0,33)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,153L50,153L50,203L0,203L0,153"],["fill","url(#karas-defs-0-3)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M-10,204L56.66666666666666,204L56.66666666666666,254L-10,254L-10,204"],["fill","url(#karas-defs-0-4)"],["transform","matrix(0.75,0,0,1,7.5,0)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",25],["cy",25],["r",35.35533905932738]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"radialGradient","props":[["cx",10],["cy",61],["r",56.568542494923804]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":1,"uuid":"karas-defs-0-1","index":1},{"tagName":"radialGradient","props":[["cx",10],["cy",132],["r",56.568542494923804]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":2,"uuid":"karas-defs-0-2","index":2},{"tagName":"radialGradient","props":[["cx",30],["cy",183],["r",42.42640687119285]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":3,"uuid":"karas-defs-0-3","index":3},{"tagName":"radialGradient","props":[["cx",30],["cy",214],["r",56.568542494923804]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":4,"uuid":"karas-defs-0-4","index":4}]}')
      .end();
  }
};
