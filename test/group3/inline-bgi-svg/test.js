let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '<defs></defs><g></g><g><g visibility="visible"><g><path d="M10,10L60,10L60,143.388671875L10,143.388671875L10,10" fill="rgba(204,204,204,1)"></path></g><g><g visibility="visible"><g></g><g><g><text x="10" y="24.484375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">22222</text></g><g visibility="visible"><g></g><g><g><text x="13" y="73.662109375" fill="rgba(0,0,0,1)" font-family="arial" font-weight="700" font-style="normal" font-size="50px">3</text><text x="10" y="131.1572265625" fill="rgba(0,0,0,1)" font-family="arial" font-weight="700" font-style="normal" font-size="50px">3</text></g></g></g><g><text x="40.8125" y="131.1572265625" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px">2</text></g></g></g></g></g><g visibility="visible"><g><path d="M10,153.388671875L143.388671875,153.388671875L143.388671875,203.388671875L10,203.388671875L10,153.388671875" fill="rgba(204,204,204,1)"></path></g><g><g visibility="visible"><g></g><g><g><text x="19.19921875" y="153.388671875" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px" writing-mode="vertical-lr">22222</text></g><g visibility="visible"><g></g><g><g><text x="57.14599609375" y="156.388671875" fill="rgba(0,0,0,1)" font-family="arial" font-weight="700" font-style="normal" font-size="50px" writing-mode="vertical-lr">3</text><text x="114.64111328125" y="153.388671875" fill="rgba(0,0,0,1)" font-family="arial" font-weight="700" font-style="normal" font-size="50px" writing-mode="vertical-lr">3</text></g></g></g><g><text x="103.41015625" y="184.201171875" fill="rgba(0,0,0,1)" font-family="arial" font-weight="400" font-style="normal" font-size="16px" writing-mode="vertical-lr">2</text></g></g></g></g></g></g>')
      .end();
  }
};
