let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M90,0C90,-49.70562748477142 130.2943725152286,-90 180,-90C229.7056274847714,-90 270,-49.70562748477142 270,0C270,49.70562748477142 229.7056274847714,90 180,90C130.2943725152286,90 90,49.70562748477142 90,0M165.6,0C165.6,-7.952900397563427 172.04709960243656,-14.4 180,-14.4C187.95290039756344,-14.4 194.4,-7.952900397563427 194.4,0C194.4,7.952900397563427 187.95290039756344,14.4 180,14.4C172.04709960243656,14.4 165.6,7.952900397563427 165.6,0"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"opacity":1,"type":"geom"}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[],"cache":true}')
      .end();
  }
};
