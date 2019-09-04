module.exports = (function(settings) {
  settings.selenium = {
  'start_process': true,
    'server_path': require('selenium-server').path,
    host_path: '127.0.0.1',
    'port': 4444,
    'cli_args': {
      'webdriver.chrome.driver': require('chromedriver').path,
    },
    check_process_delay: 5000,
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
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        chromeOptions: {
          w3c: false,
        },
      }
    },
  };
  return settings;
})(require('./nightwatch.json'));
