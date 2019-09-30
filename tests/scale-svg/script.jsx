let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',transform:'scaleX(2)'}}>1</div>
    <div style={{width:100,height:100,background:'#00F',transform:'scaleY(2)'}}>2</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
