let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(100)
      .assert.value('input', '"<defs><mask id=\\"karas-defs-0-0\\"><path d=\\"M0,0L100,100L0,100L0,0\\" fill=\\"rgba(238,238,238,1)\\" stroke-width=\\"0\\" transform=\\"matrix(1,0,0,1,5,0)\\"></path></mask></defs><g></g><g><g visibility=\\"visible\\"><g></g><g><g><text x=\\"0\\" y=\\"14.484375\\" fill=\\"rgba(0,0,0,1)\\" font-family=\\"arial\\" font-weight=\\"400\\" font-style=\\"normal\\" font-size=\\"16px\\">looooooooooooooong</text></g></g></g><g visibility=\\"visible\\" mask=\\"url(#karas-defs-0-0)\\"><g><path d=\\"M5,10L105,10L105,110L5,110L5,10\\" fill=\\"rgba(255,0,0,1)\\"></path></g><g><g><text x=\\"5\\" y=\\"24.484375\\" fill=\\"rgba(0,0,0,1)\\" font-family=\\"arial\\" font-weight=\\"400\\" font-style=\\"normal\\" font-size=\\"16px\\">123</text></g></g></g></g>"')
      .end();
  }
};
