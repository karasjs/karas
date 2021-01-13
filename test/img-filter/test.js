let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEgtwNS7YAAADpSURBVBNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8EELTf3DAyCEAgOAEEHbwACB8CEPBLAEH7zQ0jgwAEghNA0MELgPAhAAG/BBC039wwMghAIDgBBB28AAgfAhDwSwBB+80NI4MABIITQNDBC4DwIQABvwQQtN/cMDIIQCA4AQQdvAAIHwIQ8EsAQfvNDSODAASCE0DQwQuA8CEAAb8E/h/pOXSk/U0tKAAAAABJRU5ErkJggg==')
      .end();
  }
};