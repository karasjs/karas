let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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EpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQloKCDFsawJCABCShoe0ACEpBAUAIKOmhhDEsCEpCAgrYHJCABCQQl8P/gvD87dlFd5gAAAABJRU5ErkJggg==')
      .end();
  }
};
