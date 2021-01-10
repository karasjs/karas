let o = karas.render(
  <svg width="360" height="360">
    <span>1</span>
    <div style={{position:'absolute',display:'none'}}>
      <span>2</span>
    </div>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
