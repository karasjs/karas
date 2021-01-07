let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M82.71235839037395,230.18659303678638L95.11583184929466,-100.57269920110286L293.57140719202823,-17.882876141631073L281.1679337331075,312.87641609625814L82.71235839037395,230.18659303678638"],["fill","url(#karas-defs-0-0)"],["transform","matrix(0.12403473458920766,0.9922778767136677,-0.2976833630141003,0.037210420376762296,108.26351371575117,-70.63898325357394)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"radialGradient","props":[["cx",110],["cy",40],["r",80.62257748298549]],"children":[{"tagName":"stop","props":[["stop-color","rgba(255,0,0,1)"],["offset","0%"]]},{"tagName":"stop","props":[["stop-color","rgba(0,0,255,1)"],["offset","100%"]]}],"id":0,"uuid":"karas-defs-0-0","index":0}]}')
      .end();
  }
};
