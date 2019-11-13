var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25 25 L25 0 A25 25 0 0 1 37.5 3.349364905389031 z"],["fill","transparent"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25 75 L25 50 A25 25 0 0 1 37.5 53.34936490538903 z"],["fill","transparent"]]},{"type":"item","tagName":"path","props":[["d","M25 50 A25 25 0 0 1 37.5 53.34936490538903"],["fill","transparent"],["stroke","#000"],["stroke-width",1]]}],"transform":[],"type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25 125 L25 100 A25 25 0 1 1 16.44949641685828 148.49231551964772 z"],["fill","transparent"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1]]}],"transform":[],"type":"geom"}],"transform":[],"opacity":1,"type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",25],["y1",100],["x2",25],["y2",150]],"stop":[["#F00",0],["#00F",1]],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
