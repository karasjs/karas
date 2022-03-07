let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L360,0L360,36.796875L0,36.796875L0,0"],["fill","rgba(255,255,255,1)"]]}],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",28.96875],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","32px"]],"content":"本周收益"}]}],"visibility":"visible","type":"dom","cache":true,"lv":0},{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","https://mdn.alipayobjects.com/yuyan_hca3c9/afts/img/fbzYQImrg_YAAAAAAAAAAAAAFqh2AQBr"],["x",128],["y",3.96875],["width",60],["height",60],["transform","matrix(0.8,0,0,0.4166666666666667,25.599999999999994,2.3151041666666665)"]]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","lv":0}],"visibility":"visible","type":"dom","lv":0}],"visibility":"visible","type":"dom","lv":0}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
