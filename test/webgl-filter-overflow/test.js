let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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e+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQICgC4SkRAQQ6EmAoHvmrmsEEChAgKALhKREBBDoSYCge+auawQQKECAoAuEpEQEEOhJgKB75q5rBBAoQOD/AA0ksZb/TCDbAAAAAElFTkSuQmCC')
      .end();
  }
};