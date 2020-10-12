let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,25C0,11.19288125423016 11.19288125423016,0 25,0C38.80711874576984,0 50,11.19288125423016 50,25C50,38.80711874576984 38.80711874576984,50 25,50C11.19288125423016,50 0,38.80711874576984 0,25"],["fill","url(#karas-defs-0-1)"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M12.5,75C12.5,68.09644062711509 18.09644062711508,62.5 25,62.5C31.90355937288492,62.5 37.5,68.09644062711509 37.5,75C37.5,81.90355937288491 31.90355937288492,87.5 25,87.5C18.09644062711508,87.5 12.5,81.90355937288491 12.5,75"],["fill","url(#karas-defs-0-3)"],["stroke","url(#karas-defs-0-2)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",25],["y1",50],["x2",25],["y2",0]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",25],["y1",-3.552713678800501e-15],["x2",25],["y2",50]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-1"},{"tagName":"linearGradient","props":[["x1",25],["y1",100],["x2",25],["y2",50]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-2"},{"tagName":"linearGradient","props":[["x1",25],["y1",50],["x2",25],["y2",100]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-3"}]}')
      .end();
  }
};
