let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",0],["width",100],["height",100],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,49.99999999999999,-20.710678118654755)","type":"dom"}],"visibility":"visible","transform":"matrix(1,0,0,1,100,0)","type":"dom"},{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",100],["width",100],["height",100],["fill","rgba(255,0,0,1)"]]}],"children":[{"bb":[{"type":"item","tagName":"rect","props":[["x",0],["y",100],["width",100],["height",100],["fill","rgba(0,0,255,1)"]]}],"children":[],"visibility":"visible","transform":"matrix(0.7071067811865476,0.7071067811865475,-0.7071067811865475,0.7071067811865476,70.71067811865474,29.289321881345245)","type":"dom"}],"visibility":"visible","transform":"matrix(1,0,0,1,100,0)","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
