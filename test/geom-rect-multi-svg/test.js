let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"type":"item","tagName":"path","props":[["d","M12,2L92,2C97.52284749830794,2 102,4.238576250846032 102,7L102,47C102,49.76142374915397 97.52284749830794,52 92,52L12,52C6.477152501692064,52 2,49.76142374915397 2,47L2,7C2,4.238576250846032 6.477152501692064,2 12,2M42,2L62,2C84.09138999323174,2 102,10.954305003384128 102,22L102,32C102,43.04569499661587 84.09138999323174,52 62,52L42,52C19.908610006768257,52 2,43.04569499661587 2,32L2,22C2,10.954305003384128 19.908610006768257,2 42,2"],["fill","rgba(0,0,0,0)"],["stroke","rgba(0,0,0,1)"],["stroke-width",1]]}],"type":"geom"}],"type":"dom","defs":[]}')
      .end();
  }
};
