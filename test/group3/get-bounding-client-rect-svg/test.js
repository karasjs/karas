let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"left":99.13499492031626,"top":-0.8650050796837405,"right":200.86500507968373,"bottom":100.86500507968374,"points":[{"x":100.88023556404461,"y":-0.8650050796837405,"z":0,"w":1},{"x":200.86500507968373,"y":0.8802355640446107,"z":0,"w":1},{"x":199.1197644359554,"y":100.86500507968374,"z":0,"w":1},{"x":99.13499492031626,"y":99.11976443595539,"z":0,"w":1}]}')
      .end();
  }
};
