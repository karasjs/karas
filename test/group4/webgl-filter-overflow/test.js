let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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NTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7AgTdPmINIoBAVQIEXTU5dSOAQHsCBN0+Yg0igEBVAgRdNTl1I4BAewIE3T5iDSKAQFUCBF01OXUjgEB7Av8ANo23lnw2UeAAAAAASUVORK5CYII=')
      .end();
  }
};
