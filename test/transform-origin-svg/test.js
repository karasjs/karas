let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(0,0,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1"}]}],"visibility":"visible","transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,0,0)","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,100L100,100L100,200L0,200L0,100"],["fill","rgba(0,0,255,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",114.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1"}]}],"visibility":"visible","transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,141.42135623730948,58.57864376269049)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
