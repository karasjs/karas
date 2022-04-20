let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L110,10L110,110L10,110L10,10"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,120L46.796875,120L46.796875,137.7969L10,137.7969L10,120"],["fill","rgba(0,255,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",28.3984375],["y",120],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","32px"],["writing-mode","vertical-lr"]],"content":"a"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,147.7969L350,147.7969L350,181.0390625L10,181.0390625L10,147.7969"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,162.640625L36.7031,162.640625L36.7031,180.77734375L10,180.77734375L10,162.640625"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",177.125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"aaa"}]}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M36.7031,147.7969L55.1015375,147.7969L55.1015375,177.125L36.7031,177.125L36.7031,147.7969"],["fill","rgba(0,255,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",45.90231875],["y",147.7969],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"],["writing-mode","vertical-lr"]],"content":"bbb"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};