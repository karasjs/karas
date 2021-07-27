let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#00F',transform:'rotate(45deg)',transformOrigin:'top left'}}>1</div>
    <div style={{width:100,height:100,background:'#00F',transform:'rotate(45deg)',transformOrigin:'0% 100%'}}>1</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
