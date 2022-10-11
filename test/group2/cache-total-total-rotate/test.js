let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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CBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEBDoDlWbBAgQKBAQ6AJEEwQIEOgQEOgOVZsECBAoEBDoAkQTBAgQ6BAQ6A5VmwQIECgQEOgCRBMECBDoEPh/PhoHtBd/kG4AAAAASUVORK5CYII=')
      .end();
  }
};
