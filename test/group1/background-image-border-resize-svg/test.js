let path = require('path');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",100],["y",100],["width",100],["height",100],["transform","matrix(0.6,0,0,0.6,40,40)"],["clip-path","url(#karas-defs-0-0)"]]},{"type":"item","tagName":"path","props":[["d","M100,100L105,100L105,105L100,100M105,100L155,100L155,105L105,105M155,100L160,100L160,100L155,105"],["fill","rgba(0,255,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M160,100L160,100L160,105L155,105M155,105L160,105L160,125L155,125M155,125L160,125L160,130L160,130"],["fill","rgba(0,255,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M100,130L105,125L105,130L100,130M105,125L155,125L155,130L105,130M155,125L160,130L160,130L155,130"],["fill","rgba(0,255,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M100,100L100,100L105,105L100,105M100,105L105,105L105,125L100,125M100,125L105,125L100,130L100,130"],["fill","rgba(0,255,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M100,100L199.99999999999997,100L199.99999999999997,150L100,150L100,100"],["fill","#FFF"]]}],"id":0,"uuid":"karas-defs-0-0","index":0}],"lv":0}')
      .end();
  }
};
