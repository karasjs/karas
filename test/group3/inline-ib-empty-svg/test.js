let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,22.3125L50,22.3125L50,72.3125L0,72.3125L0,22.3125"],["fill","rgba(255,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,72.3125L50,72.3125L50,122.3125L0,122.3125L0,72.3125"],["fill","rgba(0,255,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,118.3984375L10,118.3984375L10,136.796875L0,136.796875L0,118.3984375"],["fill","rgba(204,204,204,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,NaNL50,NaNL50,NaNL0,NaNL0,NaN"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,NaNL360,NaNL360,NaNL0,NaNL0,NaN"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M0,NaNL360,NaNL360,NaNL0,NaNL0,NaN"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M20,NaNL21,NaNL21,NaNL20,NaNL20,NaN"],["fill","rgba(204,204,204,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
