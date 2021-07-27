let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L100,0L100,100L0,100L0,0"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,49.99999999999999,-20.710678118654755)","type":"dom"}],"visibility":"visible","transform":"matrix(1,0,0,1,100,0)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .moveToElement('svg', 150, 50)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 110, 10)
      .mouseButtonClick(0)
      .assert.value('input', '0')
      .moveToElement('svg', 90, 50)
      .mouseButtonClick(0)
      .assert.value('input', '1')
      .end();
  }
};
