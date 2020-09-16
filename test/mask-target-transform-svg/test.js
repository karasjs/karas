var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"looooooooooooooong"}]}],"opacity":1,"type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",5],["y",10],["width",100],["height",100],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",5],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"opacity":1,"transform":"matrix(0.984807753012208,0.17364817766693033,-0.17364817766693033,0.984807753012208,21.254464244344376,-8.63911495241365)","type":"dom","mask":"url(#karas-defs-0-0)"}],"opacity":1,"type":"dom","defs":[{"tagName":"mask","props":[],"children":[{"type":"item","tagName":"path","props":[["d","M0,0L100,100L0,100L0,0"],["fill","rgba(238,238,238,1)"],["stroke","rgba(0,0,0,1)"],["stroke-width",0],["transform","matrix(0.9969381141126463,-0.17364817766693036,0.017364817766693033,0.9848077530122081,-9.969381141126464,1.7364817766693037)"]]}],"uuid":"karas-defs-0-0"}]}')
      .end();
  }
};
