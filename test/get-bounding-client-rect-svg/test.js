let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"left":99.13499492031626,"top":-0.8650050796837405,"right":200.86500507968373,"bottom":100.86500507968374,"points":[[100.88023556404461,-0.8650050796837405],[200.86500507968373,0.8802355640446107],[199.1197644359554,100.86500507968374],[99.13499492031626,99.11976443595539]]}')
      .end();
  }
};
