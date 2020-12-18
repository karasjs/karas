let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25,25L25,0C29.388416586246528,0 33.69951975392152,1.1551566122657704 37.5,3.349364905389031L25,25"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25,50C29.388416586246528,50 33.69951975392152,51.15515661226577 37.5,53.34936490538903"],["fill","none"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"},{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M25,125L25,100C38.807118745769834,100 50,111.19288125423016 50,125C50,138.80711874576983 38.807118745769834,150 25.000000000000004,150C22.08371121580253,150 19.189911467449356,149.48974502759796 16.44949641685828,148.49231551964772L25,125"],["fill","none"],["stroke","url(#karas-defs-0-0)"],["stroke-width",1]]}],"visibility":"visible","type":"geom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"linearGradient","props":[["x1",25],["y1",100],["x2",25],["y2",150]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"uuid":"karas-defs-0-0","index":0}]}')
      .end();
  }
};
