let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAAAXNSR0IArs4c6QAADY9JREFUeF7t1kFNpFEUhNGLC5YjBXnIGBm9RMoskUE6IbNBQH0Jpw381aduKu/l7h5393l+BYHXu3u/u49CGBkIENgKvNzd37v7t43h698Cf777MNBOggCBM9CtIzDQrT6kITAVMNBT/h8fN9CtPqQhMBUw0FN+A93il4ZAS8BAt/rwgm71IQ2BqYCBnvJ7Qbf4pSHQEjDQrT68oFt9SENgKmCgp/xe0C1+aQi0BAx0qw8v6FYf0hCYChjoKb8XdItfGgItAQPd6sMLutWHNASmAgZ6yu8F3eKXhkBLwEC3+vCCbvUhDYGpgIGe8ntBt/ilIdASMNCtPrygW31IQ2AqYKCn/F7QLX5pCLQEDHSrDy/oVh/SEJgKGOgpvxd0i18aAi0BA93qwwu61Yc0BKYCBnrK7wXd4peGQEvAQLf68IJu9SENgamAgZ7ye0G3+KUh0BIw0K0+vKBbfUhDYCpgoKf8XtAtfmkItAQMdKsPL+hWH9IQmAoY6Cm/F3SLXxoCLQED3erDC7rVhzQEpgIGesrvBd3il4ZAS8BAt/rwgm71IQ2BqYCBnvJ7Qbf4pSHQEjDQrT68oFt9SENgKmCgp/xe0C1+aQi0BAx0qw8v6FYf0hCYChjoKb8XdItfGgItAQPd6sMLutWHNASmAgZ6yu8F3eKXhkBLwEC3+vCCbvUhDYGpgIGe8ntBt/ilIdASMNCtPrygW31IQ2AqYKCn/F7QLX5pCLQEDHSrDy/oVh/SEJgKGOgpvxd0i18aAi0BA93qwwu61Yc0BKYCBnrK7wXd4peGQEvAQLf68IJu9SENgamAgZ7ye0G3+KUh0BIw0K0+vKBbfUhDYCpgoKf8XtAtfmkItAQMdKsPL+hWH9IQmAoY6Cm/F3SLXxoCLQED3erDC7rVhzQEpgIGesrvBd3il4ZAS8BAt/rwgm71IQ2BqYCBnvJ7Qbf4pSHQEjDQrT68oFt9SENgKmCgp/xe0C1+aQi0BAx0qw8v6FYf0hCYChjoKb8XdItfGgItAQPd6sMLutWHNASmAgZ6yu8F3eKXhkBLwEC3+vCCbvUhDYGpgIGe8ntBt/ilIdASMNCtPrygW31IQ2AqYKCn/F7QLX5pCLQEDHSrDy/oVh/SEJgKGOgpvxd0i18aAi0BA93qwwu61Yc0BKYCBnrK7wXd4peGQEvAQLf68IJu9SENgamAgZ7ye0G3+KUh0BIw0K0+vKBbfUhDYCpgoKf8XtAtfmkItAQMdKsPL+hWH9IQmAoY6Cm/F3SLXxoCLQED3erDC7rVhzQEpgIGesrvBd3il4ZAS8BAt/rwgm71IQ2BqYCBnvJ7Qbf4pSHQEjDQrT68oFt9SENgKmCgp/xe0C1+aQi0BAx0qw8v6FYf0hCYChjoKb8XdItfGgItAQPd6sMLutWHNASmAgZ6yu8F3eKXhkBLwEC3+vCCbvUhDYGpgIGe8ntBt/ilIdASMNCtPrygW31IQ2AqYKCn/F7QLX5pCLQEDHSrDy/oVh/SEJgKGOgpvxd0i18aAi0BA93qwwu61Yc0BKYCBnrK7wXd4peGQEvAQLf68IJu9SENgamAgZ7ye0G3+KUh0BIw0K0+vKBbfUhDYCpgoKf8XtAtfmkItAQMdKsPL+hWH9IQmAoY6Cm/F3SLXxoCLYHnQD/u7rMV69emeb2797v7+LUC/jgBAv8FngP9xiMlYJxTdQhDYCfwHGg/AgQIEAgKGOhgKSIRIEDgKWCg3QEBAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAgY6WoxYBAgQMNBugAABAlEBAx0tRiwCBAgYaDdAgACBqICBjhYjFgECBAy0GyBAgEBUwEBHixGLAAECBtoNECBAICpgoKPFiEWAAAED7QYIECAQFTDQ0WLEIkCAgIF2AwQIEIgKGOhoMWIRIEDAQLsBAgQIRAUMdLQYsQgQIGCg3QABAgSiAl9DpS54RV/YdgAAAABJRU5ErkJggg==')
      .end();
  }
};
