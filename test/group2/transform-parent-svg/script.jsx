let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,background:'#00F',transform:'translateX(100px)'}}>
      <span>1</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
