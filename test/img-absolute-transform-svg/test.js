var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<svg width="360" height="360"><defs></defs><g></g><g><g transform="matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,179.99999999999997,-95.26911934581187)"><g></g><g><image xlink:href="../image.png" x="180" y="180" width="100" height="100"></image></g></g></g></svg>')
      .end();
  }
};
