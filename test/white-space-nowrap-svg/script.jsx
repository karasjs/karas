let o = karas.render(
  <svg width="360" height="360">
    <span style={{width:30,whiteSpace:'nowrap',background:'#F00'}}>123456</span>
    <span>abc</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
