let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:'100%',background:'url(../image.png)'}}>123</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
