let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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TAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFBDoJpQxAgQITAsI9LS49QgQINAUEOgmlDECBAhMCwj0tLj1CBAg0BQQ6CaUMQIECEwLCPS0uPUIECDQFPh/ZcGbr6Rnnn4AAAAASUVORK5CYII=')
      .end();
  }
};
