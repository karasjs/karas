let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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pcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFVDQpcEYiwABAgraDhAgQKBUQEGXBmMsAgQIKGg7QIAAgVIBBV0ajLEIECCgoO0AAQIESgUUdGkwxiJAgICCtgMECBAoFfgvOi5rr8Hr5PEAAAAASUVORK5CYII=')
      .moveToElement('canvas', 1, 1)
      .pause(20)
      .assert.value('input', 'data:image/png;base64,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DcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpgIIuDcZYBAgQUNB2gAABAqUCCro0GGMRIEBAQdsBAgQIlAoo6NJgjEWAAAEFbQcIECBQKqCgS4MxFgECBBS0HSBAgECpwH8A9DVrr+AWxugAAAAASUVORK5CYII=')
      .moveToElement('canvas', 1, 21)
      .pause(20)
      .assert.value('input', 'data:image/png;base64,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CBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQKKOjSYIxFgAABBW0HCBAgUCqgoEuDMRYBAgQUtB0gQIBAqYCCLg3GWAQIEFDQdoAAAQKlAgq6NBhjESBAQEHbAQIECJQK/BeAGGuvfYF0sAAAAABJRU5ErkJggg==')
      .end();
  }
};
