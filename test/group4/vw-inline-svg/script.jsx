let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:160,background:'#F00'}}>
      <span>1</span>
      <span style={{marginLeft:'44vw'}}>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
