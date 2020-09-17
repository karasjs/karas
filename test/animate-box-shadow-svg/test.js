let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L28.71875,0L28.71875,20.3984375L0,20.3984375"],["fill","rgba(0,0,255,1)"],["clip-path","url(#karas-defs-0-1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L28.71875,0L28.71875,20.3984375L0,20.3984375"],["fill","#FFF"],["filter","url(#karas-defs-0-0)"],["clip-path","url(#karas-defs-0-2)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"123"}]}],"opacity":1,"type":"dom"}],"opacity":1,"type":"dom","defs":[{"tagName":"filter","props":[["x",-0.26198830409356727],["y",-0.3804670912951168],["width",1.5239766081871347],["height",1.7609341825902336]],"children":[{"tagName":"feDropShadow","props":[["dx",0],["dy",0],["stdDeviation",0.5],["flood-color","rgba(0,0,255,1)"]]}],"uuid":"karas-defs-0-0"},{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M0,0L26.71875,0L26.71875,18.3984375L0,18.3984375L0,0M0,20.3984375L28.71875,20.3984375L28.71875,0L0,0"],["fill","#FFF"]]}],"uuid":"karas-defs-0-1"},{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M0,0L0,18.3984375L26.71875,18.3984375L26.71875,0L0,0M0,0L26.71875,0L26.71875,18.3984375L0,18.3984375L0,0M0,0L28.71875,0L28.71875,20.3984375L0,20.3984375M-8,-8L-8,26.3984375L34.71875,26.3984375L34.71875,-8L-8,-8"],["fill","#FFF"]]}],"uuid":"karas-defs-0-2"}],"cache":true}')
      .end();
  }
};
