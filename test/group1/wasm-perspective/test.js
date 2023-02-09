let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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Ago6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBAQEHbAQIECIQKKOjQYIxFgAABBW0HCBAgECqgoEODMRYBAgQUtB0gQIBAqICCDg3GWAQIEFDQdoAAAQKhAgo6NBhjESBA4H+rfmeHrC4H0gAAAABJRU5ErkJggg==')
      .end();
  }
};