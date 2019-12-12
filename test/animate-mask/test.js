var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(500)
      .assert.value('input', 'data:image/png;base64,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BRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIKCg7QABAgRKBRR0aTDGIkCAgIK2AwQIECgVUNClwRiLAAECCtoOECBAoFRAQZcGYywCBAgoaDtAgACBUgEFXRqMsQgQIPC/oFMzlpGILYcAAAAASUVORK5CYII=')
      .end();
  }
};
