let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M20,10L80,25L50,40L20,10"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M20,60L80,90L50,90L20,60"],["fill","none"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M20,110L80,140L50,140L20,110"],["fill","url(#karas-defs-0-1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M20,145L80,205L50,205L20,145"],["fill","url(#karas-defs-0-2)"],["strokeWidth",0],["transform","matrix(1,0,0,0.5,0,87.5)"]]},{"type":"item","tagName":"path","props":[["d","M20,160L80,190L50,190L20,160"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",50],["x2",50],["y2",100]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",50],["y1",100],["x2",50],["y2",150]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"},{"tagName":"radialGradient","props":[["cx",50],["cy",175],["r",70.71067811865476]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-2"}]}')
      .end();
  }
};
