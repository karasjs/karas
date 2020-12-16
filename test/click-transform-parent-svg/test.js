let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",14.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"1"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,49.99999999999999,-20.710678118654755)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .moveToElement('svg', 50, 1)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 10, 10)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 50, 1)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
