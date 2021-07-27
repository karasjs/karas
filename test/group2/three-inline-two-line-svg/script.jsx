let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:50}}>
      <span>hello</span>
      <span>world</span>
      <span>!</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
