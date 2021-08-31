let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', 'data:image/png;base64,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0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJkAQVdOR20IINCaAEG3jl/zCCBQmQBBV05HbQgg0JoAQbeOX/MIIFCZAEFXTkdtCCDQmgBBt45f8wggUJnA/wBE8w3wdQGJlQAAAABJRU5ErkJggg==')
      .end();
  }
};