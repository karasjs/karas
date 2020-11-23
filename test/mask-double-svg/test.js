let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",200],["height",200],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","mask":"url(#karas-defs-0-0)"},{"bb":[{"type":"item","tagName":"rect","props":[["x",100],["y",100],["width",200],["height",200],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom","mask":"url(#karas-defs-0-1)"}],"visibility":"visible","type":"dom","defs":[{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"path","props":[["d","M50,50L150,150L50,150L50,50"],["fill","rgba(238,238,238,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",0],["transform","matrix(1,0,0,1,0,0)"]]}],"uuid":"karas-defs-0-0"},{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"path","props":[["d","M150,150L250,250L150,250L150,150"],["fill","rgba(238,238,238,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",0],["transform","matrix(1,0,0,1,0,0)"]]}],"uuid":"karas-defs-0-1"}]}')
      .end();
  }
};
