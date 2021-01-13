let o = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{width:100,height:100,background:'#000'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
let count = 0;
function cb() {
  if(++count === 3) {
    o.ref.div.removeFrameAnimate(cb);
  }
  input.value = count;
}
o.ref.div.frameAnimate(cb);
