let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>123456</div>
    <div style={{width:30,whiteSpace:'nowrap',overflow:'hidden'}}>123456</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
