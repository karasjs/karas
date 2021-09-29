let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,20C0,8.954305003384128 8.954305003384128,0 20,0L80,0C91.04569499661588,0 100,8.954305003384128 100,20L100,80C100,91.04569499661588 91.04569499661588,100 80,100L20,100C8.954305003384128,100 0,91.04569499661588 0,80"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L50,0L50,50L0,50L0,0"],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","type":"dom"}],"visibility":"visible","overflow":"url(#karas-defs-0-0)","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"clipPath","props":[],"children":[{"tagName":"path","props":[["d","M0,20C0,8.954305003384128 8.954305003384128,0 20,0L80,0C91.04569499661588,0 100,8.954305003384128 100,20L100,80C100,91.04569499661588 91.04569499661588,100 80,100L20,100C8.954305003384128,100 0,91.04569499661588 0,80"]]}],"id":0,"uuid":"karas-defs-0-0","index":0}]}')
      .end();
  }
};
