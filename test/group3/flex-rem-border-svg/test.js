let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .pause(20)
      .assert.value('input', '{"bb":[],"children":[{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M0,0L5,0L5,5L0,0M5,0L60.625,0L60.625,5L5,5M60.625,0L65.625,0L65.625,0L60.625,5"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M65.625,0L65.625,0L65.625,5L60.625,5M60.625,5L65.625,5L65.625,62.4951171875L60.625,62.4951171875M60.625,62.4951171875L65.625,62.4951171875L65.625,67.4951171875L65.625,67.4951171875"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,67.4951171875L5,62.4951171875L5,67.4951171875L0,67.4951171875M5,62.4951171875L60.625,62.4951171875L60.625,67.4951171875L5,67.4951171875M60.625,62.4951171875L65.625,67.4951171875L65.625,67.4951171875L60.625,67.4951171875"],["fill","rgba(0,0,0,1)"]]},{"type":"item","tagName":"path","props":[["d","M0,0L0,0L5,5L0,5M0,5L5,5L5,62.4951171875L0,62.4951171875M0,62.4951171875L5,62.4951171875L0,67.4951171875L0,67.4951171875"],["fill","rgba(0,0,0,1)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",5],["y",50.263671875],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","50px"]],"content":"ab"}]}],"visibility":"visible","type":"dom"},{"bb":[],"children":[{"type":"img","tagName":"image","props":[["xlink:href","../../image.png"],["x",65.625],["y",0],["width",100],["height",100],["transform","matrix(0.5,0,0,0.674951171875,32.8125,0)"]]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[],"lv":0}')
      .end();
  }
};
