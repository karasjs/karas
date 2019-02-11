module.exports = (function(settings) {
  settings.selenium = {
  'start_process': true,
    'server_path': require('selenium-server').path,
    host_path: '127.0.0.1',
    'port': 4444,
    'cli_args': {
      'webdriver.chrome.driver': require('chromedriver').path,
      'webdriver.gecko.driver': require('geckodriver').path,
    },
  };
  settings.test_settings = {
    default: {
      'launch_url' : 'http://localhost:3000',
      'selenium_port'  : 4444,
      'selenium_host'  : 'localhost',
      'silent': true,
      'screenshots' : {
        'enabled' : false,
        'path' : '',
      },
      'desiredCapabilities': {
        'browserName': 'firefox',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
      }
    },
  };
  return settings;
})(require('./nightwatch.json'));
