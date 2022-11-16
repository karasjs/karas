let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L50,0L50,50L0,50L0,0"],["fill","rgba(255,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L5,0L5,5L0,0M5,0L45,0L45,5L5,5M45,0L50,0L50,0L45,5"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M50,0L50,0L50,5L45,5M45,5L50,5L50,45L45,45M45,45L50,45L50,50L50,50"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,50L5,45L5,50L0,50M5,45L45,45L45,50L5,50M45,45L50,50L50,50L45,50"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L0,0L5,5L0,5M0,5L5,5L5,45L0,45M0,45L5,45L0,50L0,50"],["fill","rgba(0,0,0,1)"]]}],"children":[],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,60L90,60L90,90L0,90L0,60"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M90,60L200,60L200,90L90,90L90,60"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
