let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L20,0L20,20L0,20L0,0"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","cache":true,"transform":"matrix(1,0,0,1,60,0)","lv":1}],"visibility":"visible","type":"dom","lv":0},{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M20,20L40,20L40,40L20,40L20,20"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","cache":true,"transform":"matrix(1,0,0,1,50,0)","lv":1}],"visibility":"visible","type":"dom","lv":0},{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M40,40L60,40L60,60L40,60L40,40"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom","cache":true,"transform":"matrix(1,0,0,1,10,0)","lv":1}],"visibility":"visible","type":"dom","transform":"matrix(1,0,0,1,0,40)","lv":2}],"visibility":"visible","type":"dom","lv":0}],"visibility":"visible","type":"dom","lv":0}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
