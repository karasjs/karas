var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"polygon","props":[["points","20,10 80,25 50,40 "],["fill","transparent"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polygon","props":[["points","20,60 80,90 50,90 "],["fill","transparent"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polygon","props":[["points","20,110 80,140 50,140 "],["fill","url(#karas-defs-0-1)"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"polygon","props":[["points","20,160 80,190 50,190 "],["fill","url(#karas-defs-0-2)"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"type":"geom"}],"transform":[],"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",50],["y1",49.99999999999999],["x2",50],["y2",100]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"},{"tagName":"linearGradient","props":[["x1",50],["y1",100],["x2",50],["y2",150]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-1"},{"tagName":"radialGradient","props":[["cx",50],["cy",175],["r",201.55644370746373]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-2"}]}')
      .end();
  }
};
