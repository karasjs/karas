let o = karas.render(
  <svg width="360" height="360">
    <span ref="t" style={{width:100,height:100,filter:'blur(1)',background:'url(../image.png)'}}>123</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
