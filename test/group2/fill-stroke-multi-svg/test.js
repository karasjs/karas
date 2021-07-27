let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M100,100L200,100L200,200L100,200L100,100"],["fill","url(#karas-defs-0-0)"],["stroke-width",0]]},{"type":"item","tagName":"path","props":[["d","M100,100L200,100L200,200L100,200L100,100"],["fill","url(#karas-defs-0-1)"],["stroke-width",0]]},{"type":"item","tagName":"path","props":[["d","M100,100L200,100L200,200L100,200L100,100"],["fill","none"],["stroke","rgba(0,0,0,0.5)"],["stroke-width",5]]},{"type":"item","tagName":"path","props":[["d","M100,100L200,100L200,200L100,200L100,100"],["fill","none"],["stroke","rgba(0,255,0,0.5)"],["stroke-width",10]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",150],["y1",100],["x2",150],["y2",200]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,0.5)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,0.5)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"linearGradient","props":[["x1",150],["y1",100],["x2",150],["y2",200]],"children":[{"tagName":"stop","props":[["stop-color","rgba(0,0,0,0.5)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(255,255,255,0.5)"],["offset","100%"]]}],"id":1,"uuid":"karas-defs-0-1","index":1}]}')
      .end();
  }
};
