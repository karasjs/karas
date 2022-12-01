let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L20,0L20,20L0,20L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","cache":true,"transform":"matrix(1,0,0,1,60,0)","lv":2}],"visibility":"visible","type":"dom","lv":1},{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,20L20,20L20,40L0,40L0,20"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","cache":true,"transform":"matrix(1,0,0,1,70,0)","lv":2}],"visibility":"visible","type":"dom","lv":1},{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,40L20,40L20,60L0,60L0,40"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","cache":true,"transform":"matrix(1,0,0,1,85,0)","lv":2}],"visibility":"visible","type":"dom","transform":"matrix(1,0,0,1,0,85)","lv":5}],"visibility":"visible","type":"dom","lv":1}],"visibility":"visible","type":"dom","lv":1}],"visibility":"visible","type":"dom","defs":[],"lv":1}')
      .end();
  }
};
