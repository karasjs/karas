let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",100],["y",100],["width",100],["height",100],["fill","rgba(255,0,0,1)"]]}],"children":[],"transform":"matrix(1,0,0,1,30,0)","visibility":"visible","type":"dom","mask":"url(#karas-defs-0-0)"}],"visibility":"visible","type":"dom","defs":[{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"path","props":[["d","M100,100L200,100L150,200L100,100"],["fill","rgba(255,255,255,0.5)"],["stroke","rgba(0,0,0,1)"],["stroke-width",0],["transform","matrix(0.9396926207859084,0.3420201433256687,-0.3420201433256687,0.9396926207859084,32.15834975738681,-52.51751891650663)"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
