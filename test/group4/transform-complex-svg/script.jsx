let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',
      transform:'rotateZ(5) scale(1) skew(1) translateY(100%)'}}/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
