let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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qklAAl3NeddVi4AItAABCXQLTJKGKAIiUE0CEuhqzruuWgREoAUISKBbYJI0RBEQgWoSkEBXc9511SIgAi1AQALdApOkIYqACFSTgAS6mvOuqxYBEWgBAhLoFpgkDVEERKCaBCTQ1Zx3XbUIiEALEJBAt8AkaYgiIALVJCCBrua866pFQARagIAEugUmSUMUARGoJgEJdDXnXVctAiLQAgQk0C0wSRqiCIhANQlIoKs577pqERCBFiAggW6BSdIQRUAEqklAAl3NeddVi4AItAABCXQLTJKGKAIiUE0CEuhqzruuWgREoAUISKBbYJI0RBEQgWoSkEBXc9511SIgAi1AQALdApOkIYqACFSTgKnmZeuqRUAERCB9AnLQ6c+RRigCIlBRAhLoik68LlsERCB9AhLo9OdIIxQBEagoAQl0RSdely0CIpA+AQl0+nOkEYqACFSUgAS6ohOvyxYBEUifgAQ6/TnSCEVABCpKQAJd0YnXZYuACKRPQAKd/hxphCIgAhUlIIGu6MTrskVABNInIIFOf440QhEQgYoSkEBXdOJ12SIgAukTkECnP0caoQiIQEUJSKArOvG6bBEQgfQJSKDTnyONUAREoKIEJNAVnXhdtgiIQPoEJNDpz5FGKAIiUFECEuiKTrwuWwREIH0CEuj050gjFAERqCgBCXRFJ16XLQIikD4BCXT6c6QRioAIVJSABLqiE6/LFgERSJ+ABDr9OdIIRUAEKkpAAl3Riddli4AIpE9AAp3+HGmEIiACFSUgga7oxOuyRUAE0icggU5/jjRCERCBihKQQFd04nXZIiAC6ROQQKc/RxqhCIhARQlIoCs68bpsERCB9AlIoNOfI41QBESgogQk0BWdeF22CIhA+gQk0OnPkUYoAiJQUQIS6IpOvC5bBEQgfQIS6PTnSCMUARGoKAEJdEUnXpctAiKQPgEJdPpzpBGKgAhUlIAEuqITr8sWARFIn4AEOv050ghFQAQqSkACXdGJ12WLgAikT0ACnf4caYQiIAIVJSCBrujE67JFQATSJyCBTn+ONEIREIGKEpBAV3TiddkiIALpE5BApz9HGqEIiEBFCUigKzrxumwREIH0CUig058jjVAERKCiBCTQFZ14XbYIiED6BCTQ6c+RRigCIlBRAhLoik68LlsERCB9Aib9IWqEIiACIlBNAuaLf4psoR14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')
      .end();
  }
};
