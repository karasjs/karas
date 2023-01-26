let o = karas.render(
  <canvas width="360" height="360">
    <div style={{height:'100%',background:'url(data:image/png;base64,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AgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBUQKCjizEWAQIEBNoNECBAICog0NHFGIsAAQIC7QYIECAQFRDo6GKMRYAAAYF2AwQIEIgKCHR0McYiQICAQLsBAgQIRAUEOroYYxEgQECg3QABAgSiAgIdXYyxCBAgINBugAABAlEBgY4uxlgECBAQaDdAgACBqIBARxdjLAIECAi0GyBAgEBU4N9tobOH91y4RAAAAABJRU5ErkJggg==) noRepeat'}}/>
  </canvas>,
  '#test'
);
o.once('refresh', function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});

