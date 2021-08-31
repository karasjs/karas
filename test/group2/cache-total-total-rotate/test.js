let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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kwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAgLdoWqTAAECBQICXYBoggABAh0CAt2hapMAAQIFAgJdgGiCAAECHQIC3aFqkwABAgUCAl2AaIIAAQIdAv8PlsrypSpqg78AAAAASUVORK5CYII=')
      .end();
  }
};