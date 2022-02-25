let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgK/AMN2slpQ5/zuAAAAABJRU5ErkJggg==')
      .end();
  }
};