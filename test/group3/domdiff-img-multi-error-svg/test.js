let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(40)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g></g><g><rect x="0" y="68" width="32" height="32" stroke="#CCC" stroke-width="0.64" fill="rgba(0,0,0,0)"></rect><circle cx="22.4" cy="77.6" r="3.2" fill="#DDD"></circle><polygon points="4.8,90.4 9.6,80.8 16,87.2 19.2,84 28.8,93.6 4.8,93.6" fill="#DDD"></polygon></g></g><g visibility="visible"><g></g><g><image xlink:href="../../image.png" x="32" y="0" width="100" height="100"></image></g></g><g visibility="visible"><g></g><g><rect x="132" y="68" width="32" height="32" stroke="#CCC" stroke-width="0.64" fill="rgba(0,0,0,0)"></rect><circle cx="154.4" cy="77.6" r="3.2" fill="#DDD"></circle><polygon points="136.8,90.4 141.6,80.8 148,87.2 151.2,84 160.8,93.6 136.8,93.6" fill="#DDD"></polygon></g></g></g>')
      .end();
  }
};
