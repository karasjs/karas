let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L654,0L654,148L0,148L0,0"],["fill","rgba(0,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,31.5L147,31.5L147,116.5L0,116.5L0,31.5"],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",68.5916015625],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","36px"]],"content":"187.26"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",110.17159999999998],["y",68.5916015625],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","36px"]],"content":"亿"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",0],["y",107.627734375],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","24px"]],"content":"管理规模"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","opacity":0.550000011920929,"type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M292,31.5L388,31.5L388,116.5L292,116.5L292,31.5"],["fill","rgba(0,255,0,1)"]]}],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",292],["y",68.5916015625],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","36px"]],"content":"12"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",332.0624],["y",68.5916015625],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","36px"]],"content":"年"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",292],["y",107.627734375],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","24px"]],"content":"从业年限"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","opacity":0.550000011920929,"type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M533,32.5L654,32.5L654,115.5L533,115.5L533,32.5"],["fill","rgba(0,0,255,1)"]]}],"children":[{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",533],["y",69.5916015625],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","36px"]],"content":"36.44"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",619.1404],["y",67.28471111918607],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","24px"]],"content":"%"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"bb":[],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",540],["y",106.627734375],["fill","rgba(255,255,255,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","24px"]],"content":"年化回报"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","opacity":0.550000011920929,"type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
