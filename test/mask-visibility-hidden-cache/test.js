let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAN2klEQVR4Xu3bsakVaBSF0aMyLQiCqTVYz7QgCmJmB3ZhY4YWIAwMIvhA5AU7+jRYNz6wf9aFL7ncJ+dDgAABAn+lwJO/8lUeRYAAAQL3a6Cf3d3Hu/twd2/u7hMfAgQIEPhzAg+BfnF3n+/u+d29urt3Av3nvhTLBAgQ+CHwEOi3d/f67v69u6939/63QP9zd/8hI0CAAIFO4CHQL+/uy8/Zb48E+und/d89yxIBAgQIPPYj4WOBJkWAAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAK+KPKKuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAoI9CrljgABArGAQMfg5ggQILAKCPQq5Y4AAQKxgEDH4OYIECCwCgj0KuWOAAECsYBAx+DmCBAgsAp8B8ZBFWlkRWo+AAAAAElFTkSuQmCC')
      .end();
  }
};