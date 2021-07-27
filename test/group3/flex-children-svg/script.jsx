let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}>
      <div>
        <span>12</span>
        <span>w</span>
        <span>人已关注</span>
      </div>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
