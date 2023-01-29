let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:10,height:10,background:'#00F'}} ref="div"/>
  </svg>,
  '#test'
);
let div = o.ref.div;
div.animate([
  {},
  {
    translateX: 100
  }
], {
  duration: 1000
});
div.frameAnimate(function() {
  div.updateStyle({
    translateY: 10,
  });
});
o.pause();
setTimeout(function() {
  let input = document.querySelector('#base64');
  let res = div.getComputedStyle();
  input.value = res.translateX + ',' + res.translateY;
  o.resume();
  setTimeout(function() {
    let res = div.getComputedStyle();
    input.value += res.translateX > 0 && res.translateY === 10;
  }, 100);
}, 100);
